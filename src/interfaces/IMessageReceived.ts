import { messageType } from "../types/MessageType";

export interface IMessageReceived {
    author: string,
    chatId: string,
    text?: string,
    type: messageType,
    media?: Buffer | string,
    isGroup: boolean,
    messageId: string,
    isMe: boolean,
    replyMessage?:IMessageReceived
}