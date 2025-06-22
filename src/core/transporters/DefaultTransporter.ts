/**
 * @module DefaultTransporter
 */

import { Gear } from "../Gear";
import { IMessageConnection } from "../../interfaces/IMessageConnection";
import { IMessageReceived } from "../../interfaces/IMessageReceived";
import { IFlowResponse } from "../../interfaces/IFlowResponse";
import { IMessageSend, TransportMessage } from "../../interfaces";

/**
 * A transporter class responsible for logging connection and message information.
 * Extends the `Gear` class.
 */
export abstract class DefaultTransporter extends Gear {
    /**
     * Logs connection information if logging is enabled.
     * @param {TransportMessage<IMessageConnection>} msg - The message containing connection information.
     */

    transportInfoConn(msg: TransportMessage<IMessageConnection>): void {
        if (this.enableLogs) {
            this.logger.info(msg);
        }
        this.treatInfoConn(msg)
    }

    /**
     * Logs received message information if logging is enabled.
     * @param {TransportMessage<IMessageReceived>} msg - The message containing details of the received communication.
     */
    transportInfoMsg(msg: TransportMessage<IMessageReceived>): void {
        if (this.enableLogs) {
            this.logger.info(msg);
        }
        this.treatInfoMsg(msg)
    }
    /**
  * Logs received message confirm sender information if logging is enabled.
  * @param {TransportMessage<IMessageReceived>} msg - The message containing details of the message send communication.
  */
    transportMessageSenderConfirmInfo(to: string, msg: TransportMessage<IMessageSend>): void {
        if (this.enableLogs) {
            this.logger.info(msg);
        }
        this.treatInfoMessageSendConfirm(to, msg)
    }


    /**
  * Logs received flow information if logging is enabled.
  * @param {TransportMessage<IFlowResponse>} msg - The message containing details of the flow communication.
  */
    transportInfoFlow(msg: TransportMessage<IFlowResponse>): void {
        if (this.enableLogs) {
            this.logger.info(msg);
        }
        this.treatInfoFlow(msg)
    }

    /**
     * treat msg object
     * @param {TransportMessage<IFlowResponse>} msg - The message containing details of the flow.
     */
    protected treatInfoFlow(msg: TransportMessage<IFlowResponse>) {

    }

    /**
     * treat msg object
     * @param {TransportMessage<IMessageConnection>} msg - The message containing details of the received communication.
     */
    protected treatInfoConn(msg: TransportMessage<IMessageConnection>) {

    }

    /**
     * treat msg object
     * @param {TransportMessage<IMessageReceived>} msg - The message containing details of the received communication.
     */
    protected treatInfoMsg(msg: TransportMessage<IMessageReceived>) {

    }

    /**
   * treat msg object
   * @param {String} to - id that received the message.
   * @param {TransportMessage<IMessageSend>} msg - The message containing details of the received communication.
   */
    protected treatInfoMessageSendConfirm(to: string, msg: TransportMessage<IMessageSend>) {

    }
}
