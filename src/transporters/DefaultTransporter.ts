import { Gear } from "../core/Gear";

export class DefaultTransporter extends Gear {

    transportInfo(event: string, msg: any) {
        
        this.ev.emit(event, JSON.stringify(msg))
    }

}