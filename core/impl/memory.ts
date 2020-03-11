import {HighLow} from "../interface/register";
import {IMemory} from "../interface/memory";
import {BYTE_MAX, WORD_CARY_BIT} from "../util/bits";
import {toNumber} from "../util/high-low.function";

export class Memory implements IMemory {

    data = new Int8Array(WORD_CARY_BIT)

    load(address: HighLow): number {
        return this.data[toNumber(address)] & BYTE_MAX;
    }

    store(address: HighLow, value: number): IMemory {
        this.data[toNumber(address)] = value;
        return this;
    }

}

export function build(): IMemory {
    return new Memory();
}
