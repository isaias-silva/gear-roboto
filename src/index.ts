import { DefaultChatBot } from "./core/chatbots/DefaultChatBot";
import { CommandLineEngine } from "./core/engines/CommandLineEngine";
import { DefaultEngine } from "./core/engines/DefaultEngine";
import { DefaultTransporter } from "./core/transporters/DefaultTransporter";


main()
async function main(){

    const engine= new DefaultEngine()
    const transporter= new DefaultTransporter(true)
    const chatbot= new DefaultChatBot(engine,transporter)

    await chatbot.init()
  
}
