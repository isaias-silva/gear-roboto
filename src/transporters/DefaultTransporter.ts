import { Gear } from "../core/Gear";
import { IMessageConnection } from "../interfaces/IMessageConnection";
import { IMessageReceived } from "../interfaces/IMessageReceived";

export class DefaultTransporter extends Gear {

    transportInfoConn(msg: IMessageConnection) {

        this.ev.emit("g.conn", msg)
    }


    transportInfoMsg(msg: IMessageReceived) {

        this.ev.emit("g.msg", msg)
    }
}