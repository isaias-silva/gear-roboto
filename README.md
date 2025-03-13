# gear-roboto

**gear-roboto** is a mini framework for creating and organizing chatbot logic, allowing message transport and event monitoring.

## 🚀 Installation

```sh
npm install gear-roboto
```

## 🔥 Usage Example

```typescript
import { DefaultChatBot, DefaultCommander, CommandLineEngine, CommandLineTransporter } from "gear-roboto";

async function main() {
    const commander = new DefaultCommander("!");
    commander.addCommand("hello", (engine, author) => engine.send(author, { text: "world", type: "text" }));
    
    const engine = new CommandLineEngine(commander);
    const transporter = new CommandLineTransporter();
    
    const chatbot = new DefaultChatBot(engine, transporter);
    await chatbot.init();
    chatbot.send("you", { type: "text", text: "Enter a command starting with !" });
}

main();
```

---
## 🛠 Main Structure

The library has four main classes:

1. **Commander** – Manages the chatbot's commands.
2. **Engine** – Controls external interactions.
3. **Transporter** – Manages the transport of messages and events.
4. **Chatbot** – Provides communication between the Engine and Transporter.

### 🎯 Commander (Command Manager)

The **Commander** is responsible for managing the chatbot's commands. When instantiating it, you define a prefix for the commands:

```typescript
const commander = new DefaultCommander("/"); ```

Add commands with callbacks:

```typescript
commander.addCommand("hello", (engine, author, args) => {
engine.send(author, { text: "world", type: "text" });
});
```

📌 **The callback receives the parameters in the following order:** `engine, author, args`

For the commands to be processed, the **Commander** needs to be injected into an **Engine** object:

```typescript
const engine = new CommandLineEngine(commander);
```

---

### ⚙️ Engine (Interaction Manager)

The **Engine** is responsible for handling external interactions. The base class `DefaultEngine` can be extended for different platforms.

The **CommandLineEngine**, for example, uses `readline` to interact with the user:

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

### 🔄 Transporter (Message Transporter)

The **Transporter** manages the transport of events and can be extended to different platforms (RabbitMQ, WebSocket, Kafka, etc.).

Example with the **CommandLineTransporter**:

```typescript
const transporter = new CommandLineTransporter();
```

---

### 🤖 Chatbot (General Manager)

The **Chatbot** class connects the **Engine** to the **Transporter** and allows you to send messages without accessing the Engine directly:


```typescript 
const chatbot = new DefaultChatBot(engine, transporter);
await chatbot.init();
chatbot.send("you", { type: "text", text: "Enter a command starting with !" });
 ```

---

## 📜 License

ISC © isaias-silva
