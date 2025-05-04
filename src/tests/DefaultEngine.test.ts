import { DefaultCommander } from "../core";
import { DefaultEngine } from "../core/engines/DefaultEngine"
import { IMessageSend } from "../interfaces";

export class TestEngine extends DefaultEngine {
    constructor(enableLogs?: boolean, cm?: DefaultCommander) {
        super(enableLogs, cm);
    }

    async send(to: string, message: IMessageSend): Promise<void> {
       
    }

    protected async monitoring(): Promise<void> {
      
    }
}
describe("test engine", () => {
    let engine: DefaultEngine
    beforeEach(() => {
        engine = new TestEngine()
    })

    test("defined",()=>{
        expect(engine).toBeDefined()
    })
    test("connection",()=>{
        const mockEmit = jest.spyOn(engine.getEmitter(), 'emit');

        engine.connect(["id-test"])

        expect(mockEmit).toHaveBeenCalledWith('g.conn', {
            status: 'connected',
            adInfo: expect.any(Map)
        });
       

    })
    test("disconnect", ()=>{
        const mockEmit = jest.spyOn(engine.getEmitter(), 'emit');
        const mockRemoveAllListeners = jest.spyOn(engine.getEmitter(),"removeAllListeners")
        engine.disconnect(["id-test"])


        expect(mockEmit).toHaveBeenCalledWith('g.conn', {
            status: 'disconnected',
            adInfo: expect.any(Map)
        });
        expect(mockRemoveAllListeners).toHaveBeenCalledTimes(1)
    })
    
})