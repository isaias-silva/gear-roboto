/**
 * @module Gear
 */

import { EventGearEmitter } from "./EventGearEmitter";

import { RLogger } from "./RLogger";
/**
 * Base class representing a gear mechanism with event emitting and logging capabilities.
 */
export class Gear {
    /** Indicates whether logging is enabled. */
    protected enableLogs: boolean;

    protected logger: RLogger;
    /** Instance of the event emitter for managing gear-related events. */
    private ev: EventGearEmitter;


    /**
     * Creates a new instance of `Gear`.
     * @param {boolean} [enableLogs=false] - Optional flag to enable or disable logging.
     */
    constructor(enableLogs?: boolean) {
       
        this.ev = new EventGearEmitter();
        this.enableLogs = enableLogs || false;
        this.logger = new RLogger(this.constructor.name)

    }

    /**
     * Retrieves the event emitter associated with this gear.
     * @returns {EventGearEmitter} - The event emitter instance.
     */
    getEmitter(): EventGearEmitter {
        return this.ev;
    }
    /**
     * close emitter of this gear.
     * @returns {void} 
     */
    closeEmitter(): void {
        this.ev.removeAllListeners();
    }

}