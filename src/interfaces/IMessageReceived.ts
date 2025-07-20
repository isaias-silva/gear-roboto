import { messageType } from "../types/MessageType";


export interface IMessageReceived {
    title: string,
    author?: IAuthor,
    chatId: string,
    text?: string,
    type: messageType,
    media?: Buffer | string,
    isGroup: boolean,
    messageId: string,
    isMe: boolean,
    replyMessage?: IMessageReceived,
    profile?: string

}

export interface IAuthor {
    name: string,
    alias: string,
    profile?: string,
}