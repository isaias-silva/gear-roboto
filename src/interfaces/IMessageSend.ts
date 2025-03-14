import { messageType } from "../types/MessageType";

export interface IMessageSend {
    text?: string,
    reply?: string,
    type: messageType,
    media?: Buffer | string
}