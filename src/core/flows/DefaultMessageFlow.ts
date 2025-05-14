import { IMessageReceived, IMessageSend } from "../../interfaces";
import { v4 as uuidv4 } from 'uuid';

export abstract class DefaultMessageFlow {
    private id: string;
    protected erroInResponse: boolean = false;
    protected response?: IMessageReceived;

    private nextId?: string;
    private nextErrorId?: string;

    constructor(private name: string, protected messages: IMessageSend[], id?: string) {
        this.id = id || uuidv4()
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
    getNextId() {
        return this.erroInResponse ? this.nextErrorId : this.nextId;
    }

    setNextId(next: string) {
        this.nextId = next
    }
    
    getNextErrorId(){
        return this.nextErrorId;
    }
    setNextErrorId(id: string) {
        this.nextErrorId = id;
    }

    abstract clone(): DefaultMessageFlow;
}