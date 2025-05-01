import { IMessageReceived, IMessageSend } from "../../interfaces";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class KeyWordMessageFlow extends DefaultMessageFlow {

    private nextErrorId?: string;

    constructor(message: IMessageSend, private keywords: string[]) {
        super(message)
    }

    setResponse(r: IMessageReceived): void {
        let responseMatch = false
        const { text } = r;
        if (text) {
            for (const word of this.keywords) {
                const regex = this.createRegex(word);
                if (regex.test(text)) {
                
                    responseMatch = true;
                    this.response = r;
                    break
                }
            }
        }
        if (!responseMatch && this.nextErrorId) {
            console.log("ok")
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