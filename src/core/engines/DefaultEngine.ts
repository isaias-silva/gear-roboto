
import { Gear } from "../Gear";
import { IMessageConnection } from "../../interfaces/IMessageConnection";
import { IMessageSend } from "../../interfaces/IMessageSend";
import { DefaultCommander } from "../commander/DefaultCommander";
import { DefaultFlow } from "../flows/DefaultFlow";


/**
 * Description default engine of chatbot
 *
 * @export
 * @class DefaultEngine
 * @typedef {DefaultEngine}
 * @extends {Gear}
 */
export class DefaultEngine extends Gear {

    protected commander?: DefaultCommander;

    /**
    * Creates a new instance of DefaultEngine.
    * 
    * @param {DefaultCommander} cm - The optional commander.
    */
    constructor(cm?: DefaultCommander) {
        super()
        this.commander = cm
    }

    status: IMessageConnection['status'] = 'disconnected'



    /**
     * connect engine with args
     *
     * @async
     * @param {string[]} args 
     * @returns {void}
     */
    async connect(args: string[]): Promise<void> {


        const [id] = args

        this.status = 'connected'

        const adInfo = new Map()

        adInfo.set('id', id)

        this.getEmitter().emit('g.conn', { status: this.status, adInfo })

        this.monitoring();


    }


    /**
     * disconnect engine
     *
     * @async
     * @returns {void}
     */
    async disconnect(args: string[]): Promise<void> {
        this.status = "disconnected";
        const [id] = args

        const adInfo = new Map()
        adInfo.set('id', id)

        this.getEmitter().emit('g.conn', { status: this.status, adInfo })
        this.closeEmitter()
    }



    /**
     * Send message in engine
     *
     * @async
     * @param {string} to 
     * @param {IMessageSend} message 
     * @returns {Promise<void>} 
     */
    async send(to: string, message: IMessageSend): Promise<void> { }


    async startFlowInEngine(to: string, flow: DefaultFlow) {

        flow.getEmitter().on("g.flow", (to, msg) => this.send(to,msg));
        flow.start(to, this.getEmitter());

    }

    /**
     * observer engine events
     *
     * @protected
     * @async
     * @returns {Promise<void>} 
     */
    protected async monitoring(): Promise<void> {

    }
}