import { IMessageReceived, IMessageSend } from "../../interfaces";
import { EventGearEmitter } from "../EventGearEmitter";
import { Gear } from "../Gear";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

/**
 * DefaultFlow manages a message-based conversation flow,
 * emitting events and handling active chat sessions.
 */
export class DefaultFlow extends Gear {

    /**
     * Map of message flows, indexed by ID.
     */
    private messages: Map<string, DefaultMessageFlow> = new Map();

    /**
     * Active sessions mapped by chatId to their respective listeners.
     */
    private sessions: Map<string, (msg: IMessageReceived) => void> = new Map();

    /**
    * first void message of flow.
    */
    private firstMessage?: IMessageSend | undefined;


    /**
    * last of flow.
    */
    private lastMessage?: IMessageSend


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
            this.logger.info(`start flow with ${chatId}`);
        }

        if (this.messages.size === 0) {
            throw new Error("No messages available");
        }

        let [messageNowId, messageNow] = Array.from(this.messages)[0];


        if (this.firstMessage) {
            this.getEmitter().emit("g.flow.msg", chatId, this.firstMessage)
        }
        const listener = (msg: IMessageReceived) => {
            if ((msg.author === chatId || msg.author.includes(chatId)) && !msg.isMe) {

                this.messages.get(messageNowId)?.setResponse(msg);
                const nextId = this.messages.get(messageNowId)?.getnextId();

                if (nextId) {
                    messageNowId = nextId;
                    const nextMessage = this.messages.get(nextId);

                    if (nextMessage) {
                        nextMessage.getMessages().forEach((msg) =>
                            this.getEmitter().emit("g.flow.msg", chatId, msg)
                        );
                        messageNow = nextMessage;
                    }
                } else {
                    if (this.lastMessage) {
                        if (this.firstMessage) {
                            this.getEmitter().emit("g.flow.msg", chatId, this.lastMessage)
                        }
                    }
                    this.end(chatId, engineEmitter);
                }
            }
        };

        this.sessions.set(chatId, listener);

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
        const listener = this.sessions.get(chatId);

        if (listener) {
            engineEmitter.removeListener("g.msg", listener);
            this.sessions.delete(chatId);
        }
    }

    /**
     * Ends the session completely, emits a "flow end" event,
     * and shuts down the emitter if no sessions remain.
     * @param chatId - The chat identifier.
     * @param engineEmitter - The global event emitter.
     */
    private end(chatId: string, engineEmitter: EventGearEmitter): void {
        if (this.enableLogs) {
            this.logger.info(`end session ${chatId}`);
        }

        this.getEmitter().emit("g.flow", {
            chatId,
            messages: this.messages
        });

        this.stop(chatId, engineEmitter);

        if (this.sessions.size === 0) {
            this.closeEmitter();
        }
    }
}