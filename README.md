# gear-roboto

**gear-roboto** é um mini framework para criar e organizar a lógica de chatbots, permitindo o transporte de mensagens e o monitoramento de eventos.

## 🚀 Instalação

```sh
npm install gear-roboto
```

## 🔥 Exemplo de Uso

```typescript
import { DefaultChatBot, DefaultCommander, CommandLineEngine, CommandLineTransporter } from "gear-roboto";

async function main() {
    const commander = new DefaultCommander("!");
    commander.addCommand("hello", (engine, author) => engine.send(author, { text: "world", type: "text" }));
    
    const engine = new CommandLineEngine(commander);
    const transporter = new CommandLineTransporter();
    
    const chatbot = new DefaultChatBot(engine, transporter);
    await chatbot.init();
    chatbot.send("you", { type: "text", text: "Digite algum comando iniciando por !" });
}

main();
```

---

## 🛠 Estrutura Principal

A biblioteca possui quatro classes principais:

1. **Commander** – Gerencia os comandos do chatbot.
2. **Engine** – Controla as interações externas.
3. **Transporter** – Gerencia o transporte de mensagens e eventos.
4. **Chatbot** – Faz a comunicação entre Engine e Transporter.

### 🎯 Commander (Gerenciador de Comandos)

O **Commander** é responsável por gerenciar os comandos do chatbot. Ao instanciá-lo, você define um prefixo para os comandos:

```typescript
const commander = new DefaultCommander("/");
```

Adicione comandos com callbacks:

```typescript
commander.addCommand("hello", (engine, author, args) => {
    engine.send(author, { text: "world", type: "text" });
});
```

📌 **A callback recebe os parâmetros na seguinte ordem:** `engine, author, args`

Para que os comandos sejam processados, o **Commander** precisa ser injetado em um objeto **Engine**:

```typescript
const engine = new CommandLineEngine(commander);
```

---

### ⚙️ Engine (Gerenciador de Interações)

O **Engine** é responsável por lidar com interações externas. A classe base `DefaultEngine` pode ser estendida para diferentes plataformas.

A **CommandLineEngine**, por exemplo, usa `readline` para interagir com o usuário:

```typescript
async monitoring() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    while (this.status === 'connected') {
        const text = await rl.question("");
        const author = "you";
        this.getEmitter().emit('g.msg', { type: "text", author, text, isGroup: false });
        
        if (this.commander?.isCommand(text)) {
            const { command, args } = this.commander.extractCommandAndArgs(text);
            const fun = this.commander.searchCommand(command);
            fun ? fun(this, author, args) : this.send(author, { type: "text", text: "Comando não encontrado" });
        }
    }
    rl.close();
}
```

Principais métodos da **Engine**:
- `send(to: string, message: IMessageSend)` – Envia mensagens.
- `monitoring()` – Processa mensagens recebidas.

---

### 🔄 Transporter (Transportador de Mensagens)

O **Transporter** gerencia o transporte de eventos e pode ser estendido para diferentes plataformas (RabbitMQ, WebSocket, Kafka, etc.).

Exemplo com a **CommandLineTransporter**:

```typescript
const transporter = new CommandLineTransporter();
```

---

### 🤖 Chatbot (Gerenciador Geral)

A classe **Chatbot** conecta a **Engine** ao **Transporter** e permite enviar mensagens sem acessar a Engine diretamente:

```typescript
const chatbot = new DefaultChatBot(engine, transporter);
await chatbot.init();
chatbot.send("you", { type: "text", text: "Digite algum comando iniciando por !" });
```

---

## 📜 Licença

MIT © [Seu Nome ou Organização]


