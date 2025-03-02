import { DefaultCommander } from "../core/commander/DefaultCommander"
import { CommanderFunction } from "../interfaces/CommanderFunction"

describe("test default commander", () => {

    let commander: DefaultCommander
    let testFn: CommanderFunction = async (e, a, args) => {};

    beforeEach(() => {

        commander = new DefaultCommander("#")
        commander.addCommand("test", testFn);


    })

    test("defined", () => {
        expect(commander).toBeDefined();
    })

    test("search command", () => {

        expect(commander.searchCommand("test")).toBe(testFn)
    })
    test("search command and command not found", () => {
        expect(commander.searchCommand("test2")).toBe(undefined)
    })
    test("remove command",()=>{
        commander.removeCommand("test")
        expect(commander.searchCommand("test")).toBe(undefined)
    })
    test("check if text is command",()=>{
        expect(commander.isCommand("#command")).toBe(true)
        expect(commander.isCommand("!command")).toBe(false)

    })
  
  
})