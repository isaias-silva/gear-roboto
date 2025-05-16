import { DefaultChatBot } from "../core/chatbots/DefaultChatBot";
import { DefaultEngine } from "../core/engines/DefaultEngine";
import { DefaultTransporter } from "../core/transporters/DefaultTransporter";
import { IMessageSend } from "../interfaces/IMessageSend";
import { EventGearEmitter } from "../core/EventGearEmitter";
import { DefaultFlow } from "../core/flows";

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
            startFlowInEngine: async (to: string, flow: DefaultFlow) => { }


        } as DefaultEngine

        transporter = {
            getEmitter: () => new EventGearEmitter(),
            closeEmitter: () => { }
        } as DefaultTransporter

        chatbot = new DefaultChatBot(engine, transporter)


    })



    test("should create an instance of DefaultChatBot", () => {
        expect(chatbot).toBeDefined();
    });

    test("should connect", async () => {
        const spyConnection = jest.spyOn(engine, "connect");

        await chatbot.init()

        expect(spyConnection).toHaveBeenCalled()

    })
    test("should disconnect", async () => {
        const spyDisconnection = jest.spyOn(engine, "disconnect");
        const spyCloseEmitterTransporter = jest.spyOn(transporter, "closeEmitter");

        await chatbot.end()

        expect(spyDisconnection).toHaveBeenCalled()
        expect(spyCloseEmitterTransporter).toHaveBeenCalled()

    })

    test("should start flow", async () => {
        const spyInitFlowInEngine = jest.spyOn(engine, "startFlowInEngine");
        await chatbot.startFlow("mock-chat", new DefaultFlow("test-flow"))
        expect(spyInitFlowInEngine).toHaveBeenCalled()


    })
})