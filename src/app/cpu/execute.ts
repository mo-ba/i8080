import {Inject, Injectable} from '@angular/core';
import {IExecute, OperationT} from '../../core/interface';
import {TOKEN} from './tokens';


@Injectable()
export class ObservableExecute implements IExecute {


    constructor(
        @Inject(TOKEN.ABSTRACT.EXECUTE
        ) private instance: IExecute) {
    }

    execute(op: OperationT): void {
        return this.instance.execute(op);
    }


}
