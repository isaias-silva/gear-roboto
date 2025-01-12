export interface IMessageSend {
    text?: string,
    reply?: string,
    type: "text" | "image" | "video" | "document" | "file",
    media?: Buffer | string
}