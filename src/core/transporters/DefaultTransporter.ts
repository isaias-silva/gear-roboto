/**
 * @module DefaultTransporter
 */

import { Gear } from "../Gear";
import { IMessageConnection } from "../../interfaces/IMessageConnection";
import { IMessageReceived } from "../../interfaces/IMessageReceived";

/**
 * A transporter class responsible for logging connection and message information.
 * Extends the `Gear` class.
 */
export class DefaultTransporter extends Gear {
    /**
     * Logs connection information if logging is enabled.
     * @param {IMessageConnection} msg - The message containing connection information.
     */
    transportInfoConn(msg: IMessageConnection): void {
        if (this.eneableLogs) {
            this.logger.info(msg);
        }
        this.treatInfoConn(msg)
    }

    /**
     * Logs received message information if logging is enabled.
     * @param {IMessageReceived} msg - The message containing details of the received communication.
     */
    transportInfoMsg(msg: IMessageReceived): void {
        if (this.eneableLogs) {
            this.logger.info(msg);
        }
        this.treatInfoMsg(msg)
    }


    /**
     * treat msg object
     * @param {IMessageConnection} msg - The message containing details of the received communication.
     */
    protected treatInfoConn(msg: IMessageConnection) {

    }

    /**
     * treat msg object
     * @param {IMessageConnection} msg - The message containing details of the received communication.
     */
    protected treatInfoMsg(msg: IMessageReceived) {

    }
}
