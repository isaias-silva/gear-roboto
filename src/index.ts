import { DefaultChatBot } from "./core/chatbots/DefaultChatBot";
import { DefaultCommander } from "./core/commander/DefaultCommander";
import { CommandLineEngine } from "./core/engines/CommandLineEngine";
import { DefaultEngine } from "./core/engines/DefaultEngine";
import { DefaultTransporter } from "./core/transporters/DefaultTransporter";


const commander = new DefaultCommander("#")
commander.addCommand("hello", (e: DefaultEngine, author: string) => e.send(author, { type: "text", text: "world" }))
commander.addCommand("ping", (e: DefaultEngine, author: string) => e.send(author, { type: "text", text: "pong" }))
commander.addCommand("sum", (e: DefaultEngine, author: string, args?: string[]) => {


    const numbers = args?.map(n => parseFloat(n))
    let sum = 0
    if (numbers)
        for (let n of numbers) {
            sum += n;
        }
    return e.send(author, { type: "text", text: sum.toString() });


})

const engine = new CommandLineEngine(commander)
const transporter = new DefaultTransporter()
const chatbot = new DefaultChatBot(engine, transporter)

chatbot.init()
