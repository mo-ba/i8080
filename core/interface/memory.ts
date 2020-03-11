import {HighLow} from "./register";

export interface IMemory {
    load(address: HighLow): number;

    store(address: HighLow, value: number): IMemory;

}
