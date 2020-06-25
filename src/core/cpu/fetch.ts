import {IMemory, IProgramCounter, IWord} from '../interface';
import {xIncrement} from '../util';
import {IFetch} from '../interface/fetch';


export class Fetch implements IFetch {
    constructor(
        private readonly memory: IMemory,
        private readonly programCounter: IProgramCounter,
    ) {
    }

    public fetch(): number {
        return this.memory.load(this.getProgramCounter());
    }

    public fetchWord(): IWord {
        const low = this.fetch();
        const high = this.fetch();

        return {low, high};
    }


    private getProgramCounter(): IWord {
        const counter = this.programCounter.getProgramCounter();
        this.programCounter.setProgramCounter(xIncrement(counter));
        return counter;
    }
}
