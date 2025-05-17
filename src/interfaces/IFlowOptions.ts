import { IMessageSend } from "./IMessageSend";

export interface IFlowOptions {
    
    waitingTimeForResponseMs?: number,
    timeoutMessage?: IMessageSend
    enableLogs: boolean;

}