import { IMessageSend } from "../../interfaces/IMessageSend";
import { DefaultEngine } from "./DefaultEngine";
import readline from 'node:readline/promises'

export class CommandLineEngine extends DefaultEngine {


    async send(to: string, message: IMessageSend) {
        const { text, type } = message
        this.getEmitter().emit('gear.message.received', {
            type,
            author: "me",
            chatId:"me",
            text,
             isGroup: false, 
             messageId: Math.random().toString(32), 
             isMe: true
        });

    }

    async monitoring() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        while (this.status == 'connected') {

            const text = await rl.question("")
            const author = "you"

            this.getEmitter().emit('gear.message.received', {
                type: "text",
                chatId: author,
                author,
                text,
                isGroup: false,
                messageId: Math.random().toString(32),
                isMe: false
            });

            if (this.commander && this.commander?.isCommand(text)) {
                const { command, args } = this.commander.extractCommandAndArgs(text)

                const fun = this.commander.searchCommand(command)
                if (fun) {
                    fun(this, author, args)
                } else {
                    this.send(author, { type: "text", text: "command not found" })
                }
            }

        }
        rl.close()
    }
}