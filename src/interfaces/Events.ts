
import { IFlowResponse } from "./IFlowResponse";
import { IMessageConnection } from "./IMessageConnection";
import { IMessageReceived } from "./IMessageReceived";
import { IMessageSend } from "./IMessageSend";

export interface Events {
    'gear.connection.status': (msg: IMessageConnection) => void;
    'gear.message.received': (msg: IMessageReceived) => void;
    'gear.flow.end': (msg: IFlowResponse) => void;
    'gear.message.send': (to: string, msg: IMessageSend) => void;
}
