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

     private log(level: 'info' | 'error' | 'warn', message: any): void {
        const formatted = typeof message !== "string" ? JSON.stringify(message) : message;
        this.logger[level](formatted);
    }

    info(message: any): void {
        this.log('info', message);
    }

    error(message: any): void {
        this.log('error', message);
    }

    warn(message: any): void {
        this.log('warn', message);
    }
    
    table(info: Map<any, any>, description?: string): void {
        if (description) {
            this.logger.info(description)
        }
        console.table(info)
    }
}