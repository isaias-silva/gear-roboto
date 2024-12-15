
import { Gear } from "../core/Gear";
import { IMessageConnection } from "../interfaces/IMessageConnection";
import readline from 'node:readline/promises'

export class DefaultEngine extends Gear {

    status: IMessageConnection['status'] = 'disconnected'

    async connect(args: string[]) {

        const [id] = args

        this.status = 'connected'

        const adInfo = new Map()
        adInfo.set('id', id)

        this.ev.emit('g.conn', { status: this.status, adInfo })
        this.monitoring();

    }



    async disconnect() {
        this.status = 'disconnected'
        this.ev.removeAllListeners();
    }

    async send() {

    }
  
    private async monitoring() {
        while (this.status == 'connected') {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            const text = await rl.question("your message: ")

            this.ev.emit('g.msg', { type: "text", author: "you", text, isGroup: false });

            rl.close()

        }

    }
}