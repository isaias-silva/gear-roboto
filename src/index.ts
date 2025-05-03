import { CommandLineEngine, CommandLineTransporter, DefaultChatBot, DefaultCommander } from './core';
import { DefaultFlow } from './core/flows/DefaultFlow';
import { DefaultMessageFlow } from './core/flows/DefaultMessageFlow';
import { KeyWordMessageFlow } from './core/flows/KeyWordMessageFlow';

export * from './core/chatbots';
export * from './core/engines';
export * from './core/commander';
export * from './core/transporters';
export * from './interfaces'
export * from './types'



async function main() {


    const engine = new CommandLineEngine();
    const transporter = new CommandLineTransporter();

    const flow = new DefaultFlow();


    const askToStart = new KeyWordMessageFlow([

        {
            type: "text",
            text: " Gostaria de cadastrar um aluno?"
        }], ["sim", "gostaria", "claro"]);


    const notInterested = new DefaultMessageFlow([{
        type: "text",
        text: "ok, poderia me dizer porque?"
    }]);

    const questions = [
        "nome",
        "idade",
        "curso"

    ].map(q => new DefaultMessageFlow([{ type: "text", text: q }]));


    askToStart.setNextErrorId(notInterested.getId());
    askToStart.setNextId(questions[0].getId());

    flow.setFirstMessage({ text: "olá tudo bem?", type: "text" })
    flow.setLastMessage({ text: "agradecemos as respostas", type: "text" })
    
    flow.addMessage(askToStart);
    flow.addMessage(notInterested);

    for (let i = 0; i < questions.length; i++) {
        const current = questions[i];
        const next = questions[i + 1];

        if (next) {
            current.setNextId(next.getId());
        }

        flow.addMessage(current);
    }



    const chatbot = new DefaultChatBot(engine, transporter);


    await chatbot.init();


    chatbot.startFlow("you", flow)



}

main()