
import { IFlowEnd } from "./IFlowEnd";
import { IMessageConnection } from "./IMessageConnection";
import { IMessageReceived } from "./IMessageReceived";
import { IMessageSend } from "./IMessageSend";

export interface Events {
    'g.conn': (msg: IMessageConnection) => void;
    'g.msg': (msg: IMessageReceived) => void;
    'g.flow.msg': (to: string, msg: IMessageSend) => void;
    'g.flow.end': (msg: IFlowEnd) => void;
}
