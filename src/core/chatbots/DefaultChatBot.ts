import { IMessageSend } from "../../interfaces/IMessageSend";
import { DefaultEngine } from "../engines/DefaultEngine";
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
