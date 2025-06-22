import { DefaultMessageFlow } from "../core/flows/DefaultMessageFlow";

export interface IFlowResponse{
    chatId: string,
    name: string,
    messages: DefaultMessageFlow[],

}

