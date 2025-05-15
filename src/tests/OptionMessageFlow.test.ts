import { DefaultFlow, StoreMessageFlow, OptionMessageFlow } from "../core/flows";
import { TestEngine } from "./DefaultEngine.test";

describe("test OptionMessageFlow cases", () => {

    let flow: DefaultFlow
    let mockEngine: TestEngine
    beforeEach(() => {
        flow = new DefaultFlow("test-flow");
        mockEngine = new TestEngine()
    })
    afterEach(() => {
        process.removeAllListeners("exit");
        process.removeAllListeners("beforeExit");
        process.removeAllListeners("SIGINT");
        process.removeAllListeners("uncaughtException");
    });
    test("should handle valid option and follow correct path", () => {

        const emitter = flow.getEmitter();

        const chatId = "mock-chat";
        const { step1, opt1, opt2, opt3 } = buildOptionFlow()

        flow.addMessage(step1);
        [opt1, opt2, opt3].forEach((o) => flow.addMessage(o))

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start(chatId, engineEmitter);


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "1",
            type: "text",
            isGroup: false,
            messageId: "1",
            chatId
        });


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "i like number 1",
            type: "text",
            isGroup: false,
            messageId: "2",
            chatId
        });

        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[0]);
        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, opt1.getMessages()[0]);
        expect(emitSpy).not.toHaveBeenCalledWith("g.flow.msg", chatId, opt2.getMessages()[0]);
        expect(emitSpy).not.toHaveBeenCalledWith("g.flow.msg", chatId, opt3.getMessages()[0]);


        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            name: "test-flow",
            chatId,
            messages: expect.any(Array)
        });


        expect(flow.inSession(chatId)).toBe(false);

    })

    test("should reject invalid option and accept valid one afterwards", () => {

        const emitter = flow.getEmitter();
        const chatId = "mock-chat";

        const { step1, opt1, opt2, opt3 } = buildOptionFlow()

        flow.addMessages(step1,opt1,opt2,opt3);
       

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start(chatId, engineEmitter);


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "5",
            type: "text",
            isGroup: false,
            messageId: "1",
            chatId
        });


        expect(step1.getMessages().length).toEqual(2)

        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[0]);
        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[1]);

        expect(emitSpy).not.toHaveBeenCalledWith("g.flow.msg", chatId, opt1.getMessages()[0]);
        expect(emitSpy).not.toHaveBeenCalledWith("g.flow.msg", chatId, opt2.getMessages()[0]);
        expect(emitSpy).not.toHaveBeenCalledWith("g.flow.msg", chatId, opt3.getMessages()[0]);

        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "2",
            type: "text",
            isGroup: false,
            messageId: "1",
            chatId
        });
        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "i like number 2",
            type: "text",
            isGroup: false,
            messageId: "1",
            chatId
        });

      
        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, opt2.getMessages()[0]);

        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            name: "test-flow",
            chatId,
            messages: expect.any(Array)
        });


        expect(flow.inSession(chatId)).toBe(false);

    })

})

function buildOptionFlow() {
    const opt1 = new StoreMessageFlow("1", [{ type: "text", text: "talk about number one:" }]);
    const opt2 = new StoreMessageFlow("1", [{ type: "text", text: "talk about number two?" }]);
    const opt3 = new StoreMessageFlow("1", [{ type: "text", text: "talk about number three?" }]);

    const step1 = new OptionMessageFlow(
        "1",
        [{ type: "text", text: "choose a number between 1 and 3" }],
        [
            { key: 1, nextId: opt1.getId() },
            { key: 2, nextId: opt2.getId() },
            { key: 3, nextId: opt3.getId() },
        ],
        { text: "invalid option", type: "text" }
    );

    return { step1, opt1, opt2, opt3 };
}