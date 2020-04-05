import {Injectable} from "@angular/core";
import {IMemory, IWord} from "../../core/interface";


@Injectable()
export class ObservableMemory implements IMemory {


    constructor(private memory: IMemory) {

    }

    load(address: IWord): number {
        return this.memory.load(address);
    }

    store(address: IWord, value: number): IMemory {
        return this.memory.store(address, value);
    }


}
