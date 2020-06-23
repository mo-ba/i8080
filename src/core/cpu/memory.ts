import {IMemory, IWord} from '../interface';
import {BYTE_CARRY_BIT, BYTE_MAX} from '../util';

export class Memory implements IMemory {

    public readonly data: Array<Int8Array>;

    constructor() {
        this.data = new Array(BYTE_CARRY_BIT).fill(null)
            .map(() => new Int8Array(BYTE_CARRY_BIT).fill(0));
    }

    load(address: IWord): number {
        return this.data[address.high][address.low] & BYTE_MAX;
    }

    store(address: IWord, value: number): IMemory {
        this.data[address.high][address.low] = value;
        return this;
    }

    getMemory(): Array<Int8Array> {
        return this.data;
    }

}
