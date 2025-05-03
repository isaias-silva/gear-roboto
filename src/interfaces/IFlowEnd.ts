import { DefaultMessageFlow } from "../core/flows/DefaultMessageFlow";

export interface IFlowEnd {
    chatId: string,
    messages: Map<String, DefaultMessageFlow>
}