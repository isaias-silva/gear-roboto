import { IMessageReceived, IMessageSend } from "../../interfaces";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class KeyWordMessageFlow extends DefaultMessageFlow {

    private nextErrorId?: string;

    constructor(name: string, message: IMessageSend[], private keywords: string[]) {
        super(name, message)
    }

    setResponse(r: IMessageReceived): void {
        let responseMatch = false
        const { text } = r;
        this.response = r;
        console.log(text)
        if (text) {
            for (const word of this.keywords) {
                const regex = this.createRegex(word);
                if (regex.test(text)) {
                    responseMatch = true;
                    break
                }
            }
        }
        if (!responseMatch && this.nextErrorId) {

            this.setNextId(this.nextErrorId)
        }

    }

    setNextErrorId(id: string) {
        this.nextErrorId = id;
    }
    private createRegex(word: string) {

        return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

    }
}