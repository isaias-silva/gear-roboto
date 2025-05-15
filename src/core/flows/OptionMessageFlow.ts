import { IMessageReceived, IMessageSend } from "../../interfaces";
import { ImenuOptFlow } from "../../interfaces/ImenuOptFlow";
import { DefaultMessageFlow } from "./DefaultMessageFlow";


export class OptionMessageFlow extends DefaultMessageFlow {
    private selectedOption?: ImenuOptFlow

    constructor(name: string,
        messages: IMessageSend[],
        private opts: ImenuOptFlow[],
        private errorInOptionMessage: IMessageSend,
        id?: string

    ) {
        super(name, messages, id);
        this.setNextErrorId(this.getId())
    }


    determineNextId(): string | undefined {
        this.analyzeResponses()
       
        if (this.selectedOption) {
            return this.selectedOption.nextId;
        }
        return this.getNextErrorId()
    }
    clone(): DefaultMessageFlow {
        const clone = new OptionMessageFlow(this.getName(), this.messages, this.opts, this.errorInOptionMessage, this.getId())
        const nextId = this.getNextId()
        if (nextId) {
            clone.setNextId(nextId)
        }
        return clone;

    }
    protected analyzeResponses() {

        const textOfResponses = this.responses.map(r => r.text)


        this.erroInResponse = true
        this.selectedOption = undefined

        if (this.messages.includes(this.errorInOptionMessage)) {
            this.messages.splice(0, 1)
        }

        if (textOfResponses.length > 0) {
            this.opts.forEach((opt) => {
                if (textOfResponses.find(v => v?.trim().toLowerCase() == opt.key)) {
                    
                    this.erroInResponse = false
                    this.selectedOption = opt
                }

            })
        }
        if (!this.selectedOption && this.errorInOptionMessage) {
            this.responses.splice(0, this.responses.length - 1)
            this.messages.unshift(this.errorInOptionMessage);
        }
       
    }

}