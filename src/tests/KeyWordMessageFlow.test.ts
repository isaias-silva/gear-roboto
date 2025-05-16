import { DefaultFlow, StoreMessageFlow, KeyWordMessageFlow } from "../core/flows";
import { TestEngine } from "./DefaultEngine.test";

describe("test KeyWordMessageFlow cases", () => {
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
    test("should execute flow conditional terminate", () => {

        const emitter = flow.getEmitter();

        const chatId = "mock-chat";

        const { step1, step2 } = buildKeyWordFlow()

        step1.setNextId(step2.getId());

        flow.addMessages(step1,step2);

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start(chatId, engineEmitter);


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "not",
            type: "text",
            isGroup: false,
            messageId: "1",
            chatId
        });


        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "will not be answered",
            type: "text",
            isGroup: false,
            messageId: "2",
            chatId
        });

        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[0]);
        expect(emitSpy).not.toHaveBeenCalledWith("g.flow.msg", chatId, step2.getMessages()[0]);


        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            name: "test-flow",
            chatId,
            messages: expect.any(Array)
        });


        expect(flow.inSession(chatId)).toBe(false);

    })

    test("should execute the flow and pass the conditional", () => {
        const emitter = flow.getEmitter();

        const chatId = "mock-chat";

        const { step1, step2 } = buildKeyWordFlow()

        step1.setNextId(step2.getId());
       
        flow.addMessages(step1,step2);

        const emitSpy = jest.spyOn(emitter, "emit");

        const engineEmitter = mockEngine.getEmitter()

        flow.start(chatId, engineEmitter);
       
        expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step1.getMessages()[0]);

        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "yes",
            type: "text",
            isGroup: false,
            messageId: "1",
            chatId
        });

         expect(emitSpy).toHaveBeenCalledWith("g.flow.msg", chatId, step2.getMessages()[0]);

        engineEmitter.emit("g.msg", {
            author: chatId,
            isMe: false,
            text: "john",
            type: "text",
            isGroup: false,
            messageId: "2",
            chatId
        });

       

        expect(emitSpy).toHaveBeenCalledWith("g.flow", {
            name: "test-flow",
            chatId,
            messages: expect.any(Array)
        });

        expect(flow.inSession(chatId)).toBe(false);

    })
})

function buildKeyWordFlow() {
    const step1 = new KeyWordMessageFlow("question", [{ type: "text", text: "go?" }], ["yes", "ok"]);

    const step2 = new StoreMessageFlow("name", [{ type: "text", text: "whats your name?" }]);

    return { step1, step2 }
}