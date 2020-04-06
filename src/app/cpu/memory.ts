import {Injectable} from "@angular/core";
import {IMemory, IWord} from "../../core/interface";
import {Subject} from "rxjs";
import {Memory} from "../../core/cpu";


@Injectable()
export class ObservableMemory implements IMemory {


    constructor(private memory: Memory, private subject: Subject<Array<Int8Array>>) {
    }

    load(address: IWord): number {
        return this.memory.load(address);
    }

    store(address: IWord, value: number): IMemory {
        const result = this.memory.store(address, value);
        this.subject.next(this.memory.data)
        return result;
    }


}
