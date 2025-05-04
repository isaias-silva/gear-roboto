import { IMessageReceived, IMessageSend } from "../../interfaces";
import { v4 as uuidv4 } from 'uuid';

export class DefaultMessageFlow {
    private id: string;
    protected erroInResponse: boolean = false;
    protected response?: IMessageReceived;

    private nextId?: string;
    private nextErrorId?: string;

    constructor(private name: string, protected messages: IMessageSend[]) {
        this.id = uuidv4()
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }

    getMessages() {
        return this.messages;
    }

    getResponse() {
        return this.response;
    }

    setResponse(r: IMessageReceived) {
        this.response = r;
    }
    getnextId() {
        return this.erroInResponse ? this.nextErrorId : this.nextId;
    }
    setnextId(next: string) {
        this.nextId = next
    }

    setNextErrorId(id: string) {
        this.nextErrorId = id;
    }
}