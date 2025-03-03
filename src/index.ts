import { DefaultChatBot } from "./core/chatbots/DefaultChatBot";
import { DefaultCommander } from "./core/commander/DefaultCommander";
import { CommandLineEngine } from "./core/engines/CommandLineEngine";
import { DefaultEngine } from "./core/engines/DefaultEngine";
import { DefaultTransporter } from "./core/transporters/DefaultTransporter";


main()
async function main() {

    const commander = new DefaultCommander("!")
    commander.addCommand("hello", (e, a) => e.send(a, { text: "world", type: "text" }))
    const engine = new CommandLineEngine(commander)
    const transporter = new DefaultTransporter(true)
    const chatbot = new DefaultChatBot(engine, transporter)

    await chatbot.init()

}
