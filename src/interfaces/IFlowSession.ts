import { DefaultMessageFlow } from "../core/flows";
import { IMessageReceived } from "./IMessageReceived";

export interface IFlowSession {
    listener: (msg: IMessageReceived) => void,
    sessionMessages: Map<string, DefaultMessageFlow>,
    responsesBeforeNextStep:number;
}