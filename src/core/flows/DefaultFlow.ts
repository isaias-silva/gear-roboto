import { NoMessagesInFlowException, SessionNotFoundException } from "../../exceptions";
import { IMessageReceived, IMessageSend } from "../../interfaces";
import { IFlowOptions } from "../../interfaces/IFlowOptions";
import { IFlowSession } from "../../interfaces/IFlowSession";
import { EventGearEmitter } from "../EventGearEmitter";
import { Gear } from "../Gear";
import { DefaultMessageFlow } from "./DefaultMessageFlow";
import { Timer } from "../tools/Timer";

/**
 * DefaultFlow manages a message-based conversation flow,
 * emitting events and handling active chat sessions.
 */
export class DefaultFlow extends Gear {

    constructor(private name: string, private options?: IFlowOptions) {

        super(options?.enableLogs ?? false);

    }
    /**
     * Map of message flows, indexed by ID.
     */
    private messages: Map<string, DefaultMessageFlow> = new Map();

    /**
     * Active sessions mapped by chatId to their respective listeners.
     */
    private sessions: Map<string, IFlowSession> = new Map();

    /**
    * first void message of flow.
    */
    private firstMessage?: IMessageSend;

    /**
    * last of flow.
    */
    private lastMessage?: IMessageSend;



    getMessagesFlow(): Map<string, DefaultMessageFlow> {
        return this.messages;
    }
    getFirstMessage(): IMessageSend | undefined {
        return this.firstMessage;
    }

    setFirstMessage(value: IMessageSend | undefined) {
        this.firstMessage = value;
    }
    getLastMessage(): IMessageSend | undefined {
        return this.lastMessage;
    }
    setLastMessage(value: IMessageSend | undefined) {
        this.lastMessage = value;
    }

    /**
     * Adds a message flow step to the flow sequence.
     * @param message - The message flow step to add.
     */
    addMessage(message: DefaultMessageFlow): void {
        this.messages.set(message.getId(), message);
    }

    /**
    * Adds multiple message flow steps to the flow sequence.
    * @param messages - group of messages to be added.
    */
    addMessages(...messages: DefaultMessageFlow[]): void {
        messages.forEach((message) => this.messages.set(message.getId(), message))
    }

    /**
    * remove a message flow step to the flow sequence.
    * @param id - The message flow id.
    */
    removeMessage(messageId: string): void {
        this.messages.delete(messageId)
    }

    /**
     * Checks whether a session is currently active for the given chatId.
     * @param chatId - The ID of the chat.
     * @returns `true` if a session is active, otherwise `false`.
     */
    inSession(chatId: string): boolean {
        return this.sessions.has(chatId);
    }

    /**
     * Starts the flow for a specific chatId.
     * Listens for incoming messages and progresses through the message flow.
     * @param chatId - The chat identifier.
     * @param engineEmitter - The global event emitter that emits received messages.
     */
    start(chatId: string, engineEmitter: EventGearEmitter): void {

        if (this.enableLogs) {
            this.logger.info(`Start flow with ${chatId}`);
        }

        if (this.inSession(chatId)) {
            if (this.enableLogs) {
                this.logger.warn(`Session already started for chatId: ${chatId}`);
            }
            return;
        }

        if (this.messages.size === 0) {
            throw new NoMessagesInFlowException("No messages available");
        }

        const sessionMessages = this.getSessionMessages()

        let [messageNowId, messageNow] = Array.from(sessionMessages)[0];


        if (this.firstMessage) {
            this.getEmitter().emit("g.flow.msg", chatId, this.firstMessage)
        }

        const maxResponsesBeforeNextStepFlow = this.options?.maxResponsesBeforeNextStep || 1

        const timer = this.options?.waitingTimeForResponseMs
            ? new Timer(this.options.waitingTimeForResponseMs, () => {
                if (this.options?.timeoutMessage) {
                    this.getEmitter().emit("g.flow.msg", chatId, this.options?.timeoutMessage)
                }
                this.end(chatId, engineEmitter)
            })
            : undefined;

        timer?.start();

        const listener = async (msg: IMessageReceived) => {
           
            if ((msg.author === chatId || msg.author.includes(chatId)) && !msg.isMe) {
                if (timer) {
                    timer?.reset()
                }
                sessionMessages.get(messageNowId)?.addResponse(msg);
                const sessionData = this.sessions.get(chatId) as IFlowSession;

                if (sessionData.responsesBeforeNextStep < maxResponsesBeforeNextStepFlow) {
                    this.sessions.set(chatId, { listener, sessionMessages, responsesBeforeNextStep: sessionData.responsesBeforeNextStep + 1 });
                    return;
                }
                const nextId = sessionMessages.get(messageNowId)?.determineNextId();

                if (nextId) {
                    messageNowId = nextId;
                    const nextMessage = sessionMessages.get(nextId);

                    if (nextMessage) {

                        nextMessage.getMessages().forEach((msg) =>
                            this.getEmitter().emit("g.flow.msg", chatId, msg)
                        );
                        messageNow = nextMessage;
                        this.sessions.set(chatId, { listener, sessionMessages, responsesBeforeNextStep: 1 });


                    }

                } else {
                    if (this.lastMessage) {
                        this.getEmitter().emit("g.flow.msg", chatId, this.lastMessage)
                    }
                    if (timer) {
                        timer?.stop()
                    }
                    this.end(chatId, engineEmitter);
                }
            }
        };

        this.sessions.set(chatId, { listener, sessionMessages, responsesBeforeNextStep: 1 });

        engineEmitter.on("g.msg", listener);

        messageNow.getMessages().forEach((msg) =>
            this.getEmitter().emit("g.flow.msg", chatId, msg)

        );


    }

    /**
     * Stops the flow session for the specified chatId.
     * Removes the message listener and clears session data.
     * @param chatId - The chat identifier.
     * @param engineEmitter - The global event emitter.
     */
    stop(chatId: string, engineEmitter: EventGearEmitter): void {
        const session = this.sessions.get(chatId);

        if (session) {
            engineEmitter.removeListener("g.msg", session.listener);
            this.sessions.delete(chatId);
        }
        if (this.sessions.size === 0) {
            this.closeEmitter();
        }
    }

    protected getSessionMessages(): Map<string, DefaultMessageFlow> {
        const cloneMessages: Map<string, DefaultMessageFlow> = new Map();

        this.messages.forEach((v, k) =>

            cloneMessages.set(k, v.clone())
        )

        return cloneMessages;
    }

    protected end(chatId: string, engineEmitter: EventGearEmitter): void {
        if (this.enableLogs) {
            this.logger.info(`end session ${chatId}`);
        }
        const session = this.sessions.get(chatId);
        if (session) {
            this.getEmitter().emit("g.flow", {
                name: this.name,
                chatId,
                messages: this.getObjectMessages(chatId)
            });

            this.stop(chatId, engineEmitter);


        }
    }

    protected getObjectMessages(chatId: string): DefaultMessageFlow[] {
        const session = this.sessions.get(chatId);
        if (!session) {
            throw new SessionNotFoundException("Session not found")
        }
        const obj = Object.values(Object.fromEntries(session?.sessionMessages)).filter((m) => m.getResponses().length > 0)

        return obj

    }


}