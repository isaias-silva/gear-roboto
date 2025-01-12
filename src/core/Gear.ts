import { EventGearEmitter } from "./EventGearEmitter";

export class Gear {
    protected eneableLogs: boolean;
    protected ev: EventGearEmitter

    constructor(eneableLogs?: boolean) {
        this.ev = new EventGearEmitter()
        this.eneableLogs = eneableLogs || false
    }

    getEmitter() {
        return this.ev;
    }

}