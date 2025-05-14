import { IMessageReceived, IMessageSend } from "../../interfaces";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class KeyWordMessageFlow extends DefaultMessageFlow {

    constructor(name: string, message: IMessageSend[], private keywords: string[], id?: string) {
        super(name, message, id)
    }

    setResponse(r: IMessageReceived): void {

        const { text } = r;
        this.response = r;
        this.erroInResponse = true
        if (text) {
            for (const word of this.keywords) {
                const regex = this.createRegex(word);
                if (regex.test(text)) {
                    this.erroInResponse = false;
                    break
                }
            }
        }

    }


    private createRegex(word: string) {
        return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
    }


    clone(): DefaultMessageFlow {
        const clone = new KeyWordMessageFlow(this.getName(), this.messages, this.keywords);
        const nextId = this.getNextId()

        if (nextId) clone.setNextId(nextId)

        const nextErrorId = this.getNextErrorId()

        if (nextErrorId) clone.setNextErrorId(nextErrorId)

        return clone;

    }
}