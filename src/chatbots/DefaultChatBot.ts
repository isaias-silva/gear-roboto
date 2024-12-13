import { IMessageSend } from "../interfaces/IMessageSend";
import { DefaultEngine } from "../engines/DefaultEngine";
import { DefaultTransporter } from "../transporters/DefaultTransporter";
import { v4 as uuidv4 } from 'uuid';

export class DefaultChatBot<E extends DefaultEngine, T extends DefaultTransporter> {

    id: string;
    private engine: E;
    private transporter: T;

    constructor(eng: E, tr: T) {
        this.id = uuidv4()
        this.engine = eng;
        this.transporter = tr;
    }

    async send(to: string, message: IMessageSend) {

    };
    async init() {
        return await this.engine.connect();
    }
    async observer() {
        this.engine.getEmitter().on("connection", (data) => {
            this.transporter.getEmitter().emit("connection", data)
        })

        
        this.engine.getEmitter().on("connection", (msg) => this.transporter.transportInfo("connection", msg))
        this.engine.getEmitter().on("message", (msg) => this.transporter.transportInfo("message", msg))

    }
}