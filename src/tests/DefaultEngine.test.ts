import { DefaultEngine } from "../core/engines/DefaultEngine"

describe("test default engine", () => {
    let engine: DefaultEngine
    beforeEach(() => {
        engine = new DefaultEngine()
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
        const mockRemoveAllListeners= jest.spyOn(engine.getEmitter(),"removeAllListeners")
        engine.disconnect(["id-test"])


        expect(mockEmit).toHaveBeenCalledWith('g.conn', {
            status: 'disconnected',
            adInfo: expect.any(Map)
        });
        expect(mockRemoveAllListeners).toHaveBeenCalledTimes(1)
    })
    
})