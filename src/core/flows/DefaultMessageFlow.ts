import { IMessageReceived, IMessageSend } from "../../interfaces";
import { v4 as uuidv4 } from 'uuid';

export abstract class DefaultMessageFlow {
    private id: string;
    protected erroInResponse: boolean = false;
    protected responses: IMessageReceived[] = [];

    private nextId?: string;
    private nextErrorId?: string;
    private responsesCount: number;

    constructor(private name: string, protected messages: IMessageSend[], id?: string) {
        this.id = id || uuidv4()
        this.responsesCount = 1
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

    getResponses() {
        return this.responses;
    }

    addResponse(r: IMessageReceived) {
        this.responses.push(r);
    }
    getNextId() {
        return this.nextId;
    }

    setNextId(next: string) {
        this.nextId = next
    }

    getNextErrorId() {
        return this.nextErrorId;
    }

    setNextErrorId(id: string) {
        this.nextErrorId = id;
    }
    getResponseCount() {
        return this.responsesCount;
    }
    setResponseCount(responsesCount: number) {
        this.responsesCount = responsesCount;
    }
    determineNextId() {
        this.analyzeResponses();
        return this.erroInResponse ? this.nextErrorId : this.nextId;
    }


    abstract clone(): DefaultMessageFlow;
    
    protected abstract analyzeResponses(): void;
}