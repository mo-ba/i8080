import {HighLow, IMemory} from "../interface";
import {BYTE_CARRY_BIT, BYTE_MAX} from "../util";


export class Memory implements IMemory {

    private readonly data: Array<Int8Array>;

    constructor() {
        this.data = new Array(BYTE_CARRY_BIT).fill(null)
            .map(() => new Int8Array(BYTE_CARRY_BIT).fill(0))
    }

    load(address: HighLow): number {
        return this.data[address.high][address.low] & BYTE_MAX;
    }

    store(address: HighLow, value: number): IMemory {
        this.data[address.high][address.low] = value;
        return this;
    }

}
