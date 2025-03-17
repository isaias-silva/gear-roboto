import path from "path";
import { DefaultCommander } from "../core/commander/DefaultCommander"
import { CommanderFunction } from "../interfaces/CommanderFunction"

describe("test default commander", () => {

    let commander: DefaultCommander
    let testFn: CommanderFunction = async (e, a, args) => {};

    beforeEach(() => {

        commander = new DefaultCommander(["#","!"])
       
    })

    test("defined", () => {
        expect(commander).toBeDefined();
    })
    
    test("add and search command", () => {
        commander.addCommand("test", testFn);
        expect(commander.searchCommand("test")).toBe(testFn)
    })

    test("add commands by path",async()=>{
        const commandPath=path.join("..","..","tests","mockfiles",'commands')
        commander.addCommandsByPath(commandPath)
        expect(commander.searchCommand('hello')).toBeDefined()
        expect(commander.searchCommand('ping')).toBeDefined()
    })
    test("search command and command not found", () => {
        expect(commander.searchCommand("test2")).toBe(undefined)
    })
   
    test("remove command",()=>{
        commander.removeCommand("test")
        expect(commander.searchCommand("test")).toBe(undefined)
    })
    
    test("get prefixes",()=>{
        expect(commander.getPrefixes()).toStrictEqual(["#","!"])
    })

    test("add prefixes",()=>{
        commander.addPrefix("/")
        expect(commander.getPrefixes()).toStrictEqual(["#","!","/"])

    })

    test("remove prefixes",()=>{
        commander.removePrefix("/")
        expect(commander.getPrefixes()).toStrictEqual(["#","!"])

    })
    test("check if text is command",()=>{
        expect(commander.isCommand("#command")).toBe(true)
        expect(commander.isCommand("!command")).toBe(true)
        expect(commander.isCommand("/command")).toBe(false)

    })
   
  
  
})