import { IMessageSend } from "../../interfaces/IMessageSend";
import { DefaultEngine } from "../engines/DefaultEngine";
import { DefaultFlow } from "../flows/DefaultFlow";
import { DefaultTransporter } from "../transporters/DefaultTransporter";
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a default chatbot implementation.
 * 
 * @template E The type of the engine, extending {@link DefaultEngine}.
 * @template T The type of the transporter, extending {@link DefaultTransporter}.
 * @class
 * @description A chatbot class that integrates an engine and a transporter to handle message sending and connection management.
 */
export class DefaultChatBot<E extends DefaultEngine, T extends DefaultTransporter> {

    /**
     * Unique identifier for the chatbot instance.
     * @type {string}
     */
    id: string;

    /**
     * The engine responsible for managing chatbot logic.
     * @type {E}
     * @private
     */
    private engine: E;

    /**
     * The transporter responsible for handling message transport.
     * @type {T}
     * @private
     */
    private transporter: T;

    /**
     * Creates a new instance of DefaultChatBot.
     * 
     * @param {E} eng - The engine instance.
     * @param {T} tr - The transporter instance.
     */
    constructor(eng: E, tr: T) {
        this.id = uuidv4();
        this.engine = eng;
        this.transporter = tr;
    }

    /**
     * Sends a message to a specified recipient.
     * 
     * @async
     * @param {string} to - The recipient's identifier.
     * @param {IMessageSend} message - The message to be sent.
     * @returns {Promise<void>} Resolves when the message is sent.
     */
    async send(to: string, message: IMessageSend): Promise<void> {
        this.engine.send(to, message);
    }

    /**
     * Initializes the chatbot by starting the observer and connecting the engine.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the initialization is complete.
     */

    async init(): Promise<void> {
        await this.observer();
        this.engine.connect([this.id]);
    }

    /**
    * end the chatbot process.
    * 
    * @async
    * @returns {Promise<void>} Resolves when the chatbot disconnect.
    */
    async end(): Promise<void> {
        this.engine.disconnect([this.id]);
        this.transporter.closeEmitter()
    }

    /**
     * Start flow Messages
     *  @async
     * @param {string} to chat where the flow will start.
     * @param {DefaultFlow} flow flow that will be executed.
     * @returns {Promise<void>}
     */
    async startFlow(to: string, flow: DefaultFlow): Promise<void> {
       
        if (!flow.inSession(to)) {
        
            flow.getEmitter().on("g.flow.msg", (to, msg) => this.send(to, msg));
            flow.getEmitter().on("g.flow.end", (msg) => this.transporter.transportInfoFlow(msg))
          
            flow.start(to, this.engine.getEmitter());
        }
      
    }
    /**
     * Observes engine events and delegates them to the transporter.
     * 
     * @private
     * @async
     * @returns {Promise<void>} Resolves when the observer is set up.
     */



    private async observer(): Promise<void> {
        this.engine.getEmitter().on("g.conn", (msg) => this.transporter.transportInfoConn(msg));
        this.engine.getEmitter().on("g.msg", (msg) => this.transporter.transportInfoMsg(msg));

    }
}
