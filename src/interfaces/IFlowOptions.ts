import { IMessageSend } from "./IMessageSend";

export interface IFlowOptions {
    maxResponsesBeforeNextStep?: number,
    waitingTimeForResponseMs?: number,
    timeoutMessage?: IMessageSend
    enableLogs: boolean;

}