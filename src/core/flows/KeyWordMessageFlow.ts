import { IMessageReceived, IMessageSend } from "../../interfaces";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class KeyWordMessageFlow extends DefaultMessageFlow {


    constructor(name: string, message: IMessageSend[], private keywords: string[], id?: string) {
        super(name, message, id)
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

        clone.setResponseCount(this.getResponseCount())
        return clone;

    }
    protected analyzeResponses(): void {
        const textOfResponses = this.responses.map(r => r.text)

        this.erroInResponse = true
        if (textOfResponses.length > 0) {

            for (const word of this.keywords) {
                const regex = this.createRegex(word);
                const match = textOfResponses.find((v) => v && regex.test(v))

                if (match) {

                    this.erroInResponse = false;

                    break
                }
            }
        }
    }
}