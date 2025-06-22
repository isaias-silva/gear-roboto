
import { IFlowResponse } from "./IFlowResponse";
import { IMessageConnection } from "./IMessageConnection";
import { IMessageReceived } from "./IMessageReceived";
import { IMessageSend } from "./IMessageSend";
import { TransportMessage } from "./TransportMessage";

export interface Events {
    'gear.connection.status': (msg: TransportMessage<IMessageConnection>) => void;
    'gear.message.received': (msg: TransportMessage<IMessageReceived>) => void;
    'gear.flow.end': (msg: TransportMessage<IFlowResponse>) => void;
    'gear.message.send': (to: string, msg: TransportMessage<IMessageSend>) => void;
    'gear.message.send.confirm': (to: string, msg: TransportMessage<IMessageSend>) => void;
}
