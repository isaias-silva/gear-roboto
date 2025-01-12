import { Gear } from "../Gear";
import { IMessageConnection } from "../../interfaces/IMessageConnection";
import { IMessageReceived } from "../../interfaces/IMessageReceived";

export class DefaultTransporter extends Gear {

    transportInfoConn(msg: IMessageConnection) {
        if (this.eneableLogs) {
            console.log(msg)

        }

    }


    transportInfoMsg(msg: IMessageReceived) {

        if (this.eneableLogs) {
            const { author, text } = msg
            console.log(`[${author}]: ${text}`)
        }

    }


}