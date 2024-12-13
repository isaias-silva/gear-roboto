import EventEmitter from "events"

export class Gear {
    protected ev: EventEmitter

    constructor() {
        this.ev = new EventEmitter()
    }
    getEmitter() {
        return this.ev;
    }
}