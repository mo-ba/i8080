import {OperationT} from './operation';

export interface IExecute {

    execute(op: OperationT): void
}
