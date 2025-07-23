import pino, { Logger } from "pino";
import os from 'os'
export class RLogger {
    private logger: Logger

    constructor(className: string) {

        const isDevelopment = process.env.MODE == "dev"
        const config = {
            transport: isDevelopment ? {
                target: 'pino-pretty'
            } : undefined,

            base: {
                name: className,
                service:"gear-roboto",
                pid: process.pid,
                hostname: os.hostname(),
            },
           
            timestamp: pino.stdTimeFunctions.isoTime
        }
        this.logger = pino(config)
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


}