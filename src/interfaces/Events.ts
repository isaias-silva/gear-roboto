import { IMessageConnection } from "./IMessageConnection";
import { IMessageReceived } from "./IMessageReceived";
import { IMessageSend } from "./IMessageSend";

export interface Events {
    'g.conn': (msg: IMessageConnection) => void;
    'g.msg': (msg: IMessageReceived) => void;
    'g.flow': (to: string, msg: IMessageSend) => void;

}
