import { IMessageReceived, IMessageSend } from "../../interfaces";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class KeyWordMessageFlow extends DefaultMessageFlow {

    constructor(name: string, message: IMessageSend[], private keywords: string[]) {
        super(name, message)
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
}