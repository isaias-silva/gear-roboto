import { DefaultChatBot } from "../core/chatbots/DefaultChatBot";
import { DefaultEngine } from "../core/engines/DefaultEngine";
import { DefaultTransporter } from "../core/transporters/DefaultTransporter";

export type CommanderFunction = (e: DefaultEngine, author: string, args?: string[]) => Promise<void>