import {Inject, Injectable} from '@angular/core';
import {IDecode, OperationT} from '../../core/interface';
import {BehaviorSubject} from 'rxjs';
import {TOKEN} from './tokens';

@Injectable()
export class ObservableDecode implements IDecode {


    constructor(
        @Inject(TOKEN.ABSTRACT.DECODE) private instance: IDecode,
        private subject: BehaviorSubject<OperationT>,
    ) {

    }

    decode(opCode: number): OperationT {
        const val = this.instance.decode(opCode);
        this.subject.next(val);
        return val;
    }
}
