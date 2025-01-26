/**
 * @module DefaultCommander
 */

import { CommanderFunction } from "../../interfaces/CommanderFunction";

/**
 * Class responsible for managing prefix-based commands.
 */
export class DefaultCommander {
    /** The prefix used to identify commands. */
    private prefix: string;

    /** A map of commands and their corresponding functions. */
    private commands: Map<string, CommanderFunction> = new Map();

    /**
     * Creates a new instance of `DefaultCommander`.
     * @param {string} pfix - The prefix used to identify commands.
     */
    constructor(pfix: string) {
        this.prefix = pfix;
    }

    /**
     * Adds a new command to the manager.
     * @param {string} word - The name of the command.
     * @param {CommanderFunction} fn - The function associated with the command.
     */
    addCommand(word: string, fn: CommanderFunction): void {
        this.commands.set(word, fn);
    }

    /**
     * Removes a command from the manager.
     * @param {string} word - The name of the command to be removed.
     */
    removeCommand(word: string): void {
        this.commands.delete(word);
    }

    /**
     * Searches for a command in the manager.
     * @param {string} word - The name of the command to search for.
     * @returns {CommanderFunction | undefined} - The function associated with the command, or `undefined` if not found.
     */
    searchCommand(word: string): CommanderFunction | undefined {
        return this.commands.get(word);
    }

    /**
     * Checks if a given text is a valid command.
     * @param {string} text - The text to be checked.
     * @returns {boolean} - `true` if the text is a command, otherwise `false`.
     */
    isCommand(text: string): boolean {
        return text[0] === this.prefix;
    }

    /**
     * Extracts the command name and its arguments from a string.
     * @param {string} word - The text containing the command and its arguments.
     * @returns {{ command: string, args: string[] }} - An object containing the command name and its arguments.
     */
    extractCommandAndArgs(word: string): { command: string; args: string[] } {
        const args = word.split(" ");
        const command = args[0].substring(1, args[0].length);
        args.splice(0, 1);
        return { command, args };
    }
}
