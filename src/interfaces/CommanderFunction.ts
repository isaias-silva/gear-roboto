import { DefaultEngine } from "../core/engines/DefaultEngine";
import { IMessageReceived } from "./IMessageReceived";

export type CommanderFunction = (engine: DefaultEngine, chatId: string, args?: string[], message?: IMessageReceived) => Promise<void>