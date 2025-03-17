/**
 * @module DefaultCommander
 */

import path from "path";
import * as fs from "fs";
import { CommanderFunction } from "../../interfaces/CommanderFunction";
/**
 * Class responsible for managing prefix-based commands.
 */
export class DefaultCommander {
    /** The prefix used to identify commands. */
    private prefixes: string[];

    /** A map of commands and their corresponding functions. */
    private commands: Map<string, CommanderFunction> = new Map();

    /**
     * Creates a new instance of `DefaultCommander`.
     * @param {string[]} pfixes - The prefix used to identify commands.
     */
    constructor(pfixes: string[]) {
        this.prefixes = pfixes.filter(this.isValidPrefix);
    }

    /**
     * Return all commands map
     * @returns {Map<String,CommanderFunction>}
     */
    getAllCommands(): Map<string, CommanderFunction> {
        return this.commands;
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
     * automates adding commands via directory
     * @param dir path in project root folder with commands functions
     */
    addCommandsByPath(dir: string): void {
        const dirCommand = path.join(__dirname, dir)
        const files = fs.readdirSync(dirCommand);

        for (const file of files) {
            if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

            const command: { default: CommanderFunction } = require(path.join(dirCommand, file));

            if (command.default && typeof command.default === 'function') {

                this.addCommand(command.default.name, command.default)
            }
        }
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
        let command = false;
        for (let prefix of this.prefixes) {
            if (text[0] == prefix) {
                command = true;
            }
        }
        return command;
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

    /**
        * Return all valid prefixes.
        * @returns {string[]} - prefix list.
        */
    getPrefixes(): string[] {
        return this.prefixes
    }
    /**
        * Add new prefix in prefixes list.
        * @param {string} pfix - the new prefix
        * 
        */
    addPrefix(pfix: string): void {
        if (this.isValidPrefix(pfix) && !this.prefixes.includes(pfix)) {
            this.prefixes.push(pfix)
        }
    }
    /**
        * Remove prefix of prefixes list.
        * @param {string} pfix - the  prefix
        * 
        */
    removePrefix(pfix: string): void {
        if (this.prefixes.includes(pfix)) {
            this.prefixes.slice(this.prefixes.indexOf(pfix), 1);
        }
    }



    private isValidPrefix(pfix: string): boolean {
        return pfix.length == 1;

    }
}
