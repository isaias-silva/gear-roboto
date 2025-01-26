
import { DefaultChatBot } from "../core/chatbots/DefaultChatBot";
import { DefaultEngine } from "../core/engines/DefaultEngine";
import { DefaultTransporter } from "../core/transporters/DefaultTransporter";
import { IMessageSend } from "../interfaces/IMessageSend";
import { EventGearEmitter } from "../core/EventGearEmitter";

describe("test default chatbot class", () => {
    let chatbot: DefaultChatBot<DefaultEngine, DefaultTransporter>;
    let transporter: DefaultTransporter
    let engine: DefaultEngine

    beforeEach(() => {
    
        engine = {
            connect: async (args: string[]) => { },
            send: async (to: string, message: IMessageSend) => { },
            getEmitter: () => new EventGearEmitter(),
            disconnect: async (args: string[]) => { },

        } as DefaultEngine

        transporter = {
            getEmitter: () => new EventGearEmitter()
        } as DefaultTransporter

        chatbot = new DefaultChatBot(engine, transporter)


    })



    test("should create an instance of DefaultChatBot", () => {
        expect(chatbot).toBeDefined();
    });

    test("should connect",async()=>{
        const spyConnection=jest.spyOn(engine,"connect");
        
        await chatbot.init()

        expect(spyConnection).toHaveBeenCalled()

    })
    test("should disconnect",async()=>{
        const spyDisconnection=jest.spyOn(engine,"disconnect");
        
        await chatbot.end()

        expect(spyDisconnection).toHaveBeenCalled()
    })

})