import { IMessageSend } from "../../interfaces";
import { EventGearEmitter } from "../EventGearEmitter";
import { Gear } from "../Gear";
import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class DefaultFlow extends Gear {

    private messages: Map<string, DefaultMessageFlow> = new Map()
    private sessions: string[] = []

    addMessage(message: DefaultMessageFlow) {

        this.messages.set(message.getId(), message);

    }
    start(chatId: string, engineEmitter: EventGearEmitter) {

        if (this.sessions.find((v) => v == chatId)) {
            return
        }

        this.sessions.push(chatId);

        let [messageNowId, messageNow] = Array.from(this.messages)[0]

        if (!messageNow) {
            return
        }


        engineEmitter.on("g.msg", (msg) => {

            if (msg.author == chatId || msg.author.includes(chatId)) {

                this.messages.get(messageNowId)?.setResponse(msg)
                let nextId = this.messages.get(messageNowId)?.getNextId()

                if (nextId) {
                    messageNowId = nextId
                    let nextMesage = this.messages.get(nextId)

                    if (nextMesage) {
                        this.getEmitter().emit("g.flow", chatId, nextMesage.getMessage())

                        messageNow = nextMesage;
                    }
                } else {
                    for (let msg of this.messages) {
                    
                        console.log({ question: msg[1].getMessage().text, answer: msg[1].getResponse()?.text });
                       
                    }
                    this.closeEmitter()
                }

            }
        })

        this.getEmitter().emit("g.flow", chatId, messageNow.getMessage())
    }

}

