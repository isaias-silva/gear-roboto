import { DefaultEngine } from "../core/engines/DefaultEngine";

export type CommanderFunction = (engine: DefaultEngine, author: string, args?: string[]) => Promise<void>