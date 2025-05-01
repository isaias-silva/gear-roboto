import { IMessageReceived, IMessageSend } from "../../interfaces";
import { v4 as uuidv4 } from 'uuid';

export class DefaultMessageFlow {
    protected response?: IMessageReceived;
    private id: string;
    private nextid?: string;

    constructor(private message: IMessageSend) {
        this.id = uuidv4()
    }

    getId() {
        return this.id;
    }

    getMessage() {
        return this.message;
    }

    getResponse() {
        return this.response;
    }

    setResponse(r: IMessageReceived) {
        this.response = r;
    }
    getNextId() {
        return this.nextid;
    }
    setNextId(next: string) {
        this.nextid = next
    }
}