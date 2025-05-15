import { DefaultMessageFlow } from "./DefaultMessageFlow";

export class StoreMessageFlow extends DefaultMessageFlow {

    clone(): DefaultMessageFlow {
        const clone = new StoreMessageFlow(this.getName(), this.messages, this.getId());
        const nextId = this.getNextId()
        if (nextId) {
            clone.setNextId(nextId)
        }
        return clone;
    }

    protected analyzeResponses(): void { }

}