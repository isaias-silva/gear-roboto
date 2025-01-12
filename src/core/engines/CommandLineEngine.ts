import { IMessageSend } from "../../interfaces/IMessageSend";
import { DefaultEngine } from "./DefaultEngine";
import readline from 'node:readline/promises'

export class CommandLineEngine extends DefaultEngine {


    async send(to: string, message: IMessageSend) {
        const{text,type}=message
        this.ev.emit('g.msg', { type, author:"me", text, isGroup: false });

    }

    async monitoring() {
        while (this.status == 'connected') {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            const text = await rl.question(":")
            const author = "you"

            this.ev.emit('g.msg', { type: "text", author, text, isGroup: false });

            if (this.commander && this.commander?.isCommand(text)) {
                const { command, args } = this.commander.extractCommandAndArgs(text)

                const fun = this.commander.searchCommand(command)
                if (fun) {
                    fun(this, author, args)
                } else {
                    this.send(author, { type: "text", text: "command not found" })
                }
            }



            rl.close()

        }
    }
}