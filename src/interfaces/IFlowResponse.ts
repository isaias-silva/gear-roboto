import { DefaultMessageFlow } from "../core/flows/DefaultMessageFlow";

export interface IFlowResponse {
    chatId: string,
    messages: DefaultMessageFlow[]
}

