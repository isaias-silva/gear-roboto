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
        this.engine.send()
    };
    async init() {
        await this.observer();
        this.engine.connect([this.id]);

    }
    private async observer() {


        this.engine.getEmitter().on("g.conn", (msg) => this.transporter.transportInfoConn(msg))
        
        this.engine.getEmitter().on("g.msg", (msg) => this.transporter.transportInfoMsg(msg))

    }
}