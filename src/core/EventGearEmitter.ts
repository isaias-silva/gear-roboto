import EventEmitter from "events";
import { Events } from "../interfaces/Events";


export class EventGearEmitter extends EventEmitter {


    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): boolean {
        return super.emit(event, ...args);
    }


    on<K extends keyof Events>(event: K, listener: Events[K]): this {

        return super.on(event, listener);
    }


    off<K extends keyof Events>(event: K, listener: Events[K]): this {
        return super.off(event, listener);
    }

}