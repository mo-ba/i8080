import {HighLow, IMemory} from "../interface";
import {BYTE_MAX, HighLowFN, WORD_CARY_BIT} from "../util";


export class Memory implements IMemory {

    private readonly data = new Int8Array(WORD_CARY_BIT)

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

export function buildMemory(): IMemory {
    return new Memory();
}
