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


    const transporter = new CommandLineTransporter();
    const commander = new DefaultCommander(["!"])

    const engine = new CommandLineEngine(false, commander);


    const flow = new DefaultFlow();


    const askToStart = new KeyWordMessageFlow("cadastrar",[

        {
            type: "text",
            text: " Gostaria de cadastrar um aluno?"
        }], ["sim", "gostaria", "claro"]);


    const notInterested = new DefaultMessageFlow("motivo_nao_cadastro",[{
        type: "text",
        text: "ok, poderia me dizer porque?"
    }]);

    const questions = [
        {title:"nome", quest:"qual o nome?"},
        {title:"idade", quest:"qual idade?"},
        {title:"curso", quest:"qual o curso?"},
    

    ].map(q => new DefaultMessageFlow(q.title,[{ type: "text", text: q.quest }]));


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


    commander.addCommand("aluno", async (e, a, b, m) => { e.startFlowInEngine(a, flow) })

    const chatbot = new DefaultChatBot(engine, transporter);


    await chatbot.init();
    chatbot.send("you", { type: "text", text: "digite um comando:" } )





}

main()