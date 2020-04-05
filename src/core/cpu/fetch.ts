import {HighLow, IHasProgramCounter, IMemory} from "../interface";
import {xIncrement} from "../util";
import {IFetch} from "../interface/fetch";


export class Fetch implements IFetch {
    constructor(
        private readonly memory: IMemory,
        private readonly register: IHasProgramCounter,
    ) {
    }

    public fetch(): number {
        return this.memory.load(this.getProgramCounter());
    }

    public fetchWord(): HighLow {
        const low = this.fetch()
        const high = this.fetch()

        return {low, high}
    };


    private getProgramCounter(): HighLow {
        const counter = this.register.getProgramCounter();
        this.register.setProgramCounter(xIncrement(counter));
        return counter;
    }
}
