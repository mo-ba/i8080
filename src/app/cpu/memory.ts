import {Inject, Injectable} from '@angular/core';
import {IMemory, IWord} from '../../core/interface';
import {Subject} from 'rxjs';
import {TOKEN} from './tokens';


@Injectable()
export class ObservableMemory implements IMemory {


    constructor(
        @Inject(TOKEN.ABSTRACT.MEMORY) private memory: IMemory,
        private subject: Subject<Array<Int8Array>>) {
    }

    load(address: IWord): number {
        return this.memory.load(address);
    }

    store(address: IWord, value: number): IMemory {
        const result = this.memory.store(address, value);
        this.subject.next(this.memory.getMemory());
        return result;
    }

    getMemory(): Array<Int8Array> {
        return this.memory.getMemory();
    }


}
