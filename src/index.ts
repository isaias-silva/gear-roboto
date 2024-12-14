import { DefaultChatBot } from "./chatbots/DefaultChatBot";
import { DefaultEngine } from "./engines/DefaultEngine";
import { DefaultTransporter } from "./transporters/DefaultTransporter";


const engine = new DefaultEngine()
const transporter = new DefaultTransporter()
const chatbot = new DefaultChatBot(engine, transporter)

chatbot.init()
