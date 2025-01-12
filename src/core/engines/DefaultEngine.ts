
import { Gear } from "../Gear";
import { IMessageConnection } from "../../interfaces/IMessageConnection";
import { IMessageSend } from "../../interfaces/IMessageSend";
import { DefaultCommander } from "../commander/DefaultCommander";

export class DefaultEngine extends Gear {

    protected commander?: DefaultCommander;

    constructor(cm?: DefaultCommander) {
        super()
        this.commander = cm
    }

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

    async send(to: string, message: IMessageSend) {
        

    }

    protected async monitoring() {}
}