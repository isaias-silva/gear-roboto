import { RLogger } from "../RLogger";

export class Timer {
    constructor(private durationMs: number, private callback: () => void) { }

    private running: boolean = false;
    private timer?: NodeJS.Timeout


    start() {
        if (this.running) return;
        this.running = true;

        this.timer = setTimeout(() => {
            try {
                this.callback();
            } catch (e) {
                console.error(e)
            }
            finally {
                this.running = false;
            }
        }, this.durationMs);
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        clearTimeout(this.timer);
    }

    reset() {
        this.stop();
        this.start()
    }
    isRunning() {
        return this.running;
    }

}