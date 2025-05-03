import { IFlowEnd } from "../../interfaces/IFlowEnd";
import { IMessageConnection } from "../../interfaces/IMessageConnection";
import { IMessageReceived } from "../../interfaces/IMessageReceived";
import { DefaultTransporter } from "./DefaultTransporter";

export class CommandLineTransporter extends DefaultTransporter {

    protected treatInfoConn(msg: IMessageConnection): void {
        const { adInfo } = msg;
        adInfo.forEach((v, k) => console.log(`${k} - ${v}`))

    }
    protected treatInfoMsg(msg: IMessageReceived): void {
        const { text, author } = msg
        console.log(`[${author}]: ${text}`)
    }
    protected treatInfoFlow(msg: IFlowEnd): void {

        const { messages, chatId } = msg;
        console.log(`[responses by ${chatId}]\n1`)
        messages.forEach((m) => console.log(` ${(m.getMessages().map((m2) => m2.text)).join("\n")}:\n -${m.getResponse()?.text}\n\n`))
    }
}