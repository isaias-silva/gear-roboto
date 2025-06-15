# Gear-roboto
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![eventEmitter](https://img.shields.io/badge/event-emitter-blue)

**gear-roboto** is a mini framework for creating and organizing chatbot logic, allowing message transport message flow and event monitoring.


## 🚀 Installation

```sh
npm install gear-roboto
```

## 🔥 Usage Example

```typescript
import { DefaultChatBot, DefaultCommander, CommandLineEngine, CommandLineTransporter } from "gear-roboto";

async function main() {
    const commander = new DefaultCommander(["!"]);
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
the main classes of the library such as transporters, engines and flows are child classes of the Gear class, a Gear has an event emitter to ensure communication between the gears managed by the chatbot.

Gear events:
|event | description  |
|-------|----------------|
|gear.connection.status | connection events |
|gear.message.received|  received message events|
|gear.message.send | message sending request(flow) |
|gear.flow.end     |end flow in chat |

The DefaultChatbot class manages the engine events and their sending to the transporters, but its emitters can be accessed outside the chatbot, as occurs in flows, through the method inherited from Gear, the .getEmitter() method.
___________________

The library has four main classes:

1. **[Commander](#-commander-command-manager)** – Manages the chatbot's commands.
2. **[Engine](#-engine-interaction-manager)** – Controls external interactions.
3. **[Transporter](#-transporter-message-transporter)** – Manages the transport of messages and events.
4. **[Chatbot](#-transporter-message-transporter)** – Provides communication between the Engine and Transporter.
5. **[flow](#-message-flow)** – responsible for defining a conversation flow

### 🎯 Commander (Command Manager)

The **Commander** is responsible for managing the chatbot's commands. When instantiating it, you define a prefix for the commands:

```typescript
const commander = new DefaultCommander(["/"]);

commander.addCommand("hello", (engine, author, args) => {
engine.send(author, { text: "world", type: "text" });
});
```

📌 **The callback receives the parameters in the following order:** `engine, author, args`

For the commands to be processed, the **Commander** needs to be injected into an **Engine** object:

```typescript
const engine = new CommandLineEngine(commander);
```
 #### Importing Commands from a Directory
 ```typescript
 commander.addCommandsByPath("path/commands");

 ```
Now you can automatically import commands from a directory in your project where .ts or .js files export a function implementing the CommanderFunction type.


This will load all .ts or .js files in the "commands" folder located in the project's root directory.

#### Example Command File (commands/hello.ts)
```typescript
const helloCommand: CommanderFunction = async (engine, author, args) => {
    engine.send(author, { text: "Hello, world!", type: "text" });
};

export default helloCommand;
```

After calling addCommandsByPath("commands"), the command "hello" will be available automatically. 🚀

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
        this.getEmitter().emit('gear.message.received', { type: "text", author, text, isGroup: false });
        
        if (this.commander?.isCommand(text)) {
            const { command, args } = this.commander.extractCommandAndArgs(text);
            const fun = this.commander.searchCommand(command);
            fun ? fun(this, author, args) : this.send(author, { type: "text", text: "Comando não encontrado" });
        }
    }
    rl.close();
}
```

methods of **Engine**:
- `send(to: string, message: IMessageSend)` – send message.
- `monitoring()` – monitoring messages or other events.

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
const chatbot = new CommandLineChatBot(engine, transporter);
await chatbot.init();
chatbot.send("you", { type: "text", text: "Enter a command starting with !" });
 ```

---
### 🔀 Message flow
Flows are responsible for emulating a conversation with the chatbot without relying on commands and also serve to store responses.<br>
The class responsible for managing a flow is ```DefaultFlow```, the main methods of this class are:

- `start`: start a flow.
- `addMessage`: add a message in flow.
- `addMessages`: add many messages in flow.
- `setFirstMessage`: define the first message of flow.
- `setLastMessage`: define the last message of flow.
- `getLastMessage`: return the last message of flow.
- `getFirstMessage`: return the first message of flow.
- `removeMessage`: remove a message by id.

#### 🎯 flow messages:
Structures that store and process responses have a special class, we use child classes of `DefaultMessageFlow`.<br>
StoreMessageFlow receives an array of `IMessageSend` that will be sent in sequence, the class and its children have a **linked list logic**, each object of the class has an id and a nextId of another object of the same class, the latter being able to be null, which would end the flow.

```typescript
const flow = new DefaultFlow("test-flow");

const nameMessage = new StoreMessageFlow("YOUR_NAME", [{ type: "text", text: "what's your name?" }]); //define message
const ageMessage = new StoreMessageFlow("YOUR_AGE", [{type:"text",text:"great!"},{ type: "text", text: "how old are you?" }]);

nameMessage.setNextId(ageMessage.getId()) //set next message by id

flow.addMessage(nameMessage)
flow.addMessage(ageMessage)

flow.start()
```

So far there are 3 types of MessageFlow:

| Class                | description                                                                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StoreMessageFlow`   | basic class, just stores the response                                                                                                                                                                                |
| `KeyWordMessageFlow` | compares whether the response has any of the keywords, if yes, it points to the next message, if no, it points to the error message or ends the flow if it is the last message                                       |
| `OptionMessageFlow`  | receives an object with options, the options can be numbers or strings, each option will point to a message of any type, if the response does not satisfy the options, the message is sent again informing the error |

------------------------------------

#### 🧩 practical use of MessageFlow classes

- **StoreMessageFlow**:
    ```javascript

    const nameMessage = new StoreMessageFlow("YOUR_NAME", [{ type: "text", text: "what's your name?" }]);
    flow.addMessage(nameMessage)
   
    ```
- **KeyWordMessageFlow**:
    ```typescript
    
    //keyword message
    const isRioPeopleMessage = new KeyWordMessageFlow("IS_RJ_PEOPLE", [{ type: "text", text: "Do you live in Rio de Janeiro?" }],["yes","yeah"]);
   
   //If the keywords are found in the response, the next message will be:
    const bestRestaurantInRioFromMessage = new StoreMessageFlow("BEST_RESTAURANT", [{ type: "text", text: "What is the best restaurant in Rio?" }]);
    isRioPeopleMessage.setNextId(bestRestaurantInRioFromMessage)
   
   //otherwise the next message will be:
    const whereAreYouFromMessage = new StoreMessageFlow("YOUR_CITY", [{ type: "text", text: "Oh... where are you from?" }]);
    isRioPeopleMessage.setNextErrorId(whereAreYouFromMessage)
    
    flow.addMessage(isRioPeopleMessage)
    flow.addMessage(bestRestaurantInRioFromMessage)
    flow.addMessage(whereAreYouFromMessage)

    ```
- **OptionMessageFlow**:
    ```typescript

    //define options:
    const opt1 = new StoreMessageFlow("1", [{ type: "text", text: "talk about number one:" }]);
    const opt2 = new StoreMessageFlow("2", [{ type: "text", text: "talk about number two:" }]);
    const opt3 = new StoreMessageFlow("3", [{ type: "text", text: "talk about number three:" }]);

    //define menu
    const menu = new OptionMessageFlow(
        "1",
        [{ type: "text", text: "choose a number between 1 and 3" }],
        [
            { key: 1, nextId: opt1.getId() },
            { key: 2, nextId: opt2.getId() },
            { key: 3, nextId: opt3.getId() },
        ],
        { text: "invalid option", type: "text" }
    );

    flow.addMessage(menu)
    flow.addMessages(opt1,opt2,opt3)
    
   
    ```
> the first MessageFlow to be added to the flow is the first one to be sent right after sending the firstMessage

> at the end of the flow, a `gear.flow.end` event will be fired to the transporter.


#### 🎯 First and last messages in flow:
The last and the first messages are objects that implement the interface `IMessageSend` just like in the methods `send` in [Engine](#️-engine-interaction-manager) and [Chatbot](#-chatbot-general-manager). These messages will be sent at the beginning and end of a flow as a "greeting" and a "farewell", they are two optional parameters.

``` typescript

const flow = new DefaultFlow("test-flow");
flow.setFirstMessage({type:"text",text:"hello"});
flow.setLastMessage({type:"text",text:"bye bye"});

```
> first and last messages don´t store response

#### init a flow in chatbot:

a flow can be initiated directly from the chatbot or by a CommanderFuncion passing through the engine;
- in chatbot:
  ```javascript
 
  chatbot.startFlow(to, flow)
  ```
- in the engine via commander function:
  ```javascript
 
   engine.startFlowInEngine(to, flow)
  ```


---
### Examples:
<ul>
<li>
    <a href="https://github.com/isaias-silva/apollousa">Telegram Bot</a>
</li>

</ul>

## 📜 License

ISC © isaias-silva
