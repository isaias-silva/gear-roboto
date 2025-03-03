import { DefaultChatBot } from "./core/chatbots/DefaultChatBot";
import { DefaultCommander } from "./core/commander/DefaultCommander";
import { CommandLineEngine } from "./core/engines/CommandLineEngine";
import { CommandLineTransporter } from "./core/transporters/CommandLineTransporter";



main()
async function main() {

    const commander = new DefaultCommander("!")
    commander.addCommand("hello", (e, a) => e.send(a, { text: `world ${a}`, type: "text" }))
    const engine = new CommandLineEngine(commander)
    const transporter = new CommandLineTransporter()
    const chatbot = new DefaultChatBot(engine, transporter)
    await chatbot.init()
    chatbot.send("you",{type:"text",text:"digite algum comando iniciando por ! "})

}
