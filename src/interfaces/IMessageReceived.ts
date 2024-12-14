export interface IMessageReceived {
    author: string,
    text?: string,
    type: string,
    media?: Buffer | string,
    isGroup: boolean
}