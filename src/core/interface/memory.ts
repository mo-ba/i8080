import {IWord} from "./word";

export interface IMemory {
    load(address: IWord): number;

    store(address: IWord, value: number): IMemory;

}
