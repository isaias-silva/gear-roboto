import { DefaultEngine } from "../core/engines/DefaultEngine";
import { IMessageReceived } from "./IMessageReceived";

export type CommanderFunction = (engine: DefaultEngine, author: string, args?: string[], message?: IMessageReceived) => Promise<void>