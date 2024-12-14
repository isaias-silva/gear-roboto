import { EventGearEmitter } from "./EventGearEmitter";

export class Gear {
    protected ev: EventGearEmitter

    constructor() {
        this.ev = new EventGearEmitter()
    }
    getEmitter() {
        return this.ev;
    }
    
}