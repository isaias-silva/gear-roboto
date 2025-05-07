import { IMessageReceived, IMessageSend } from "../../interfaces";
import { ImenuOptFlow } from "../../interfaces/ImenuOptFlow";
import { DefaultMessageFlow } from "./DefaultMessageFlow";


export class OptionMessageFlow extends DefaultMessageFlow {
    private selectedOption?: ImenuOptFlow

    constructor(name: string,
        messages: IMessageSend[],
        private opts: ImenuOptFlow[],
        private errorInOptionMessage: IMessageSend,

    ) {
        super(name, messages);
        this.setNextErrorId(this.getId())
    }

    setResponse(r: IMessageReceived): void {

        const { text } = r;
        this.response = r;
        this.erroInResponse = true
        this.selectedOption = undefined

        if(this.messages.includes(this.errorInOptionMessage)){
            this.messages.splice(0,1)
        }


        if (text) {
            this.opts.forEach((opt) => {
                if (text.toLowerCase().trim() == opt.key) {
                    this.erroInResponse = false
                    this.selectedOption = opt
                }

            })
        }
        if (!this.selectedOption && this.errorInOptionMessage) {
            this.messages.unshift(this.errorInOptionMessage);
        }

    }
    getNextId(): string | undefined {
        if (this.selectedOption) {
            return this.selectedOption.nextId;
        }
        return super.getNextId()

    }

}