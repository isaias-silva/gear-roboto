import { DefaultFlow, DefaultMessageFlow, StoreMessageFlow } from "../core/flows"
import { IFlowResponse } from "../interfaces"
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

    test("should add a message", () => {
        const mockMessage = new StoreMessageFlow("mock", [{ type: "text", text: "hello" }])
        flow.addMessage(mockMessage);
        expect(flow.getMessagesFlow().size).toEqual(1)
    })

    test("should add many messages", () => {

        const mockMessage = new StoreMessageFlow("mock", [{ type: "text", text: "hello" }])
        const mockMessageTwo = new StoreMessageFlow("mock", [{ type: "text", text: "hello" }])

        flow.addMessages(mockMessage, mockMessageTwo);

        expect(flow.getMessagesFlow().size).toEqual(2)
    })

    test("should start flow message", () => {
        const mockMessage = new StoreMessageFlow("mock", [{ type: "text", text: "hello" }])
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

        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[0]);
        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step2.getMessages()[0]);

        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            chatId,
            messages: expect.any(Array)
        });



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
            messages: expect.any(Array)
        });


        expect(flow.inSession(chatId)).toBe(false);

    })

    test("should set responses in multiple sessions in flow", () => {
        const emitter = flow.getEmitter();

        const { step1 } = buildDefaultFlow()



        flow.addMessages(step1);

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start("mock-one", engineEmitter);
        flow.start("mock-two", engineEmitter);

        expect(flow.inSession("mock-one")).toBe(true)
        expect(flow.inSession("mock-two")).toBe(true)

        engineEmitter.emit("g.msg", {
            author: "mock-one",
            isMe: false,
            text: "world",
            type: "text",
            isGroup: false,
            messageId: "1"
        });


        engineEmitter.emit("g.msg", {
            author: "mock-two",
            isMe: false,
            text: "world 2",
            type: "text",
            isGroup: false,
            messageId: "2"
        });

        expect(flow.inSession("mock-one")).toBe(false)
        expect(flow.inSession("mock-two")).toBe(false)

        const callsEnd = emitSpy.mock.calls.filter(
            ([eventName]) => eventName === "g.flow"
        );
        expect(callsEnd.length).toEqual(2);

        const [eventOne, eventTwo] = callsEnd

        const responseOne = eventOne[1] as IFlowResponse;
        const responseTwo = eventTwo[1] as IFlowResponse;

        expect(responseOne.chatId).toEqual("mock-one")
        expect(responseOne.messages[0].getResponse()?.text).toEqual("world")

        expect(responseTwo.chatId).toEqual("mock-two")
        expect(responseTwo.messages[0].getResponse()?.text).toEqual("world 2")

    })

    test("asynchronism sessions", async () => {
        const emitter = flow.getEmitter();

        const { step1 } = buildDefaultFlow()

        flow.addMessages(step1);

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start("promise-boy", engineEmitter);
        flow.start("promise-girl", engineEmitter);

        const sends = Promise.all([
            (async () => {
                engineEmitter.emit("g.msg", {
                    author: "promise-boy",
                    isMe: false,
                    text: "hi i am a boy",
                    type: "text",
                    isGroup: false,
                    messageId: "1"
                });
            })(),
            (async () => {
                engineEmitter.emit("g.msg", {
                    author: "promise-girl",
                    isMe: false,
                    text: "hi i am a girl",
                    type: "text",
                    isGroup: false,
                    messageId: "2"
                });
            })()
        ])

        await sends

        expect(flow.inSession("promise-boy")).toBe(false)
        expect(flow.inSession("promise-girl")).toBe(false)

        const callsEnd = emitSpy.mock.calls.filter(
            ([eventName]) => eventName === "g.flow"
        );

        expect(callsEnd.length).toEqual(2);

        const promiseBoyResponse = callsEnd.find(v => {
            const responseFlow = v[1] as IFlowResponse;
            return responseFlow.chatId == "promise-boy"
        })
        const messageResponse = promiseBoyResponse?.[1] as IFlowResponse
        expect(messageResponse.messages[0].getResponse()?.text).toEqual("hi i am a boy")

    })
})

function buildDefaultFlow() {
    const step1 = new StoreMessageFlow("1", [{ type: "text", text: "Hello" }]);
    const step2 = new StoreMessageFlow("2", [{ type: "text", text: "Goodbye" }]);

    return { step1, step2 }
}