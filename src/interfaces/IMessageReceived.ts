import { messageType } from "../types/MessageType";

export interface IMessageReceived {
    author: string,
    text?: string,
    type: messageType,
    media?: Buffer | string,
    isGroup: boolean,
    messageId: string,
}