import { DefaultFlow, DefaultMessageFlow, KeyWordMessageFlow, OptionMessageFlow } from "../core/flows"
import { TestEngine } from "./DefaultEngine.test"

describe("test flow", () => {


    let flow: DefaultFlow
    let mockEngine: TestEngine

    beforeEach(() => {
        flow = new DefaultFlow();
        mockEngine = new TestEngine()
    })
    afterEach(() => {
        process.removeAllListeners("exit");
        process.removeAllListeners("beforeExit");
        process.removeAllListeners("SIGINT");
        process.removeAllListeners("uncaughtException");
    });

    test("should start flow message", () => {
        const mockMessage = new DefaultMessageFlow("mock", [{ type: "text", text: "hello" }])
        const mockEmitter = flow.getEmitter()
        mockEngine.getEmitter()
        const mockEmit = jest.spyOn(mockEmitter, 'emit');

        flow.addMessage(mockMessage)

        flow.start("mock-chat", mockEmitter);

        expect(mockEmit).toHaveBeenCalledWith('g.flow.msg',
            "mock-chat",
            { text: "hello", type: "text" }
        );

    })
    test("should not send anything in the empty flow", () => {

        const mockEmitter = flow.getEmitter()
        mockEngine.getEmitter()


        expect(() => flow.start("mock-chat", mockEmitter)).toThrow("No messages available");

    })

    test("should execute flow and terminate", () => {

        const emitter = flow.getEmitter();

        const chatId = "mock-chat";

        const { step1, step2 } = buildDefaultFlow()


        step1.setNextId(step2.getId());

        flow.addMessage(step1);
        flow.addMessage(step2);

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start(chatId, engineEmitter);


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "world",
            type: "text",
            isGroup: false,
            messageId: "1"
        });


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "agony",
            type: "text",
            isGroup: false,
            messageId: "2"
        });

        const messages: Map<String, DefaultMessageFlow> = new Map()
        messages.set(step1.getId(), step1)
        messages.set(step2.getId(), step2)

        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            chatId,
            messages
        });
        expect(step1.getResponse()?.text).toEqual("world")
        expect(step2.getResponse()?.text).toEqual("agony")


    })


    test("should execute flow and return correct data", () => {

        const emitter = flow.getEmitter();

        const chatId = "mock-chat";


        const { step1, step2 } = buildDefaultFlow()

        step1.setNextId(step2.getId());

        flow.addMessage(step1);
        flow.addMessage(step2);

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start(chatId, engineEmitter);


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "world",
            type: "text",
            isGroup: false,
            messageId: "1"
        });


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "agony",
            type: "text",
            isGroup: false,
            messageId: "2"
        });

        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[0]);
        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step2.getMessages()[0]);

        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            chatId,
            messages: expect.any(Map)
        });


        expect(flow.inSession(chatId)).toBe(false);

    })

})

function buildDefaultFlow() {
    const step1 = new DefaultMessageFlow("1", [{ type: "text", text: "Hello" }]);
    const step2 = new DefaultMessageFlow("2", [{ type: "text", text: "Goodbye" }]);

    return { step1, step2 }
}