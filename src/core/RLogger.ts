import pino, { Logger } from "pino";

export class RLogger {
    private logger: Logger

    constructor(className: string) {
        this.logger = pino({
            base: { class: className },
            transport: {
                target: 'pino-pretty'
              }
        })
    }

    info(message: any): void {
        this.logger.info(JSON.stringify(message))
    }
    error(message: any):void {
        this.logger.error(JSON.stringify(message))

    }

    warn(message: string):void {
        this.logger.warn(JSON.stringify(message))
    }
}