import { Gear } from "../core/Gear";


export class DefaultEngine extends Gear {


    async connect(args: string[]) {
        console.log(1)
        const [id] = args
        console.log(`connection start ${id}`)

    }
    async disconnect() {
        
        this.ev.removeAllListeners();
    }
    
    async send() {

    }

}