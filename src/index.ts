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

    // Pergunta inicial
    const askToStart = new KeyWordMessageFlow({
        type: "text",
        text: "Olá! Gostaria de responder 12 perguntas sobre você? (sim/não)"
    }, ["sim", "gostaria", "claro"]);
    
    // Se a pessoa disser "não"
    const notInterested = new DefaultMessageFlow({
        type: "text",
        text: "Tudo bem, talvez em outro momento!"
    });
    
    // Cria as 12 perguntas
    const questions = [
        "Qual seu nome?",
        "Quantos anos você tem?",
        "Onde você mora?",
        "Qual sua comida favorita?",
        "Qual seu hobby?",
        "Você prefere praia ou montanha?",
        "Qual seu maior sonho?",
        "Você gosta de animais?",
        "Qual seu maior medo?",
        "Qual foi o melhor dia da sua vida?",
        "Você tem algum talento escondido?",
        "Como você descreveria sua personalidade em uma palavra?"
    ].map(q => new DefaultMessageFlow({ type: "text", text: q }));
    
    
    askToStart.setNextErrorId(notInterested.getId());
    askToStart.setNextId(questions[0].getId());
    
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
    engine.startFlowInEngine("you", flow)

}

main()