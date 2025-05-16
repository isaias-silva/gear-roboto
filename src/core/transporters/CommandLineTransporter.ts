import { IFlowResponse } from "../../interfaces/IFlowResponse";
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
    protected treatInfoFlow(msg: IFlowResponse): void {
        const { messages, chatId } = msg;

        console.log(`\n[Responses from "${chatId}"]\n`);

      
    }
}