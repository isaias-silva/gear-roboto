import { DefaultTransporter } from "../core/transporters/DefaultTransporter"
import { IFlowResponse, IMessageConnection, IMessageReceived } from "../interfaces"

class TestTransport extends DefaultTransporter {

    public treatInfoConn(msg: IMessageConnection): void {

    }
    public treatInfoFlow(msg: IFlowResponse): void {

    }
    public treatInfoMsg(msg: IMessageReceived): void {

    }
}

describe("test transporter", () => {
    let transporter: TestTransport
    beforeEach(() => {
        transporter = new TestTransport()
    })

    test("defined", () => {
        expect(transporter).toBeDefined()
    })
    test("should treat messages, connections and flows responses", () => {

        const spyTreatInfoConn = jest.spyOn(transporter, "treatInfoConn");

        transporter.transportInfoConn({ status: "connected", adInfo: new Map() })

        expect(spyTreatInfoConn).toHaveBeenCalled()

        const spyTreatInfoMsg = jest.spyOn(transporter, "treatInfoMsg");

        transporter.transportInfoMsg({
            type: "text",
            messageId: "mock-id",
            author: "mock-author",
            isGroup: false,
            isMe: false,
            chatId: "mock-id"
        })

        expect(spyTreatInfoMsg).toHaveBeenCalled()

        const spyTreatInfoFlow = jest.spyOn(transporter, "transportInfoFlow");

        transporter.transportInfoFlow({
            name: "test-flow",
            chatId: "mock-chatId",
            messages: []
        })

        expect(spyTreatInfoFlow).toHaveBeenCalled()
    })
})