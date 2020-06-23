import {OperationT} from './operation';

export interface IDecode {
    decode(opCode: number): OperationT;
}
