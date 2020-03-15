import {HighLow} from "../interface/register";
import {IMemory} from "../interface/memory";
import {BYTE_CARRY_BIT, BYTE_MAX,WORD_CARY_BIT} from "../util/bits";
import {HighLowFN} from "../util/high-low.function";


export class Memory implements IMemory {

    private readonly data= new Int8Array(WORD_CARY_BIT)

    constructor() {
        // this.data = new Array(BYTE_CARRY_BIT)
        //     .fill(1)
        //     .map(_ => new Array(BYTE_CARRY_BIT).fill(0))
    }

    load(address: HighLow): number {
        return this.data[HighLowFN.toNumber(address)] & BYTE_MAX;
    }

    store(address: HighLow, value: number): IMemory {
        this.data[HighLowFN.toNumber(address)] = value;
        return this;
    }

}

export function build(): IMemory {
    return new Memory();
}
