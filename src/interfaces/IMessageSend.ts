export interface IMessageSend {
    text?: string,
    reply?: string,
    type: "text" | "image" | "video" | "document" | "file" | "audio",
    media?: Buffer | string
}