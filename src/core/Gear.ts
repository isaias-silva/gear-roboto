/**
 * @module Gear
 */

import { EventGearEmitter } from "./EventGearEmitter";

/**
 * Base class representing a gear mechanism with event emitting and logging capabilities.
 */
export class Gear {
    /** Indicates whether logging is enabled. */
    protected eneableLogs: boolean;

    /** Instance of the event emitter for managing gear-related events. */
    protected ev: EventGearEmitter;

    /**
     * Creates a new instance of `Gear`.
     * @param {boolean} [eneableLogs=false] - Optional flag to enable or disable logging.
     */
    constructor(eneableLogs?: boolean) {
        this.ev = new EventGearEmitter();
        this.eneableLogs = eneableLogs || false;
    }

    /**
     * Retrieves the event emitter associated with this gear.
     * @returns {EventGearEmitter} - The event emitter instance.
     */
    getEmitter(): EventGearEmitter {
        return this.ev;
    }
}