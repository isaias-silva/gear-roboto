import { CommanderFunction } from "../../interfaces/CommanderFunction";


export class DefaultCommander {
    private prefix: string;
    private commands: Map<String, CommanderFunction> = new Map()

    constructor(pfix: string) {
        this.prefix = pfix;
    }

    addCommand(word: string, fn: CommanderFunction): void {
        this.commands.set(word, fn)
    }
    removeCommand(word: string): void {
        this.commands.delete(word)
    }
    searchCommand(word: string): CommanderFunction | undefined {

        return this.commands.get(word);
    }
    isCommand(text: string): boolean {
        return text[0] == this.prefix
    }
    extractCommandAndArgs(word: string) {
        const args = word.split(" ")
        const command = args[0].substring(1, args[0].length)
        args.splice(0, 1)
        return { command, args }
    }

}