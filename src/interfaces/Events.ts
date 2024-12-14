import { IMessageConnection } from "./IMessageConnection";
import { IMessageReceived } from "./IMessageReceived";

export interface Events {
    'g.conn': (msg: IMessageConnection) => void;
    'g.msg': (msg: IMessageReceived) => void;

}
