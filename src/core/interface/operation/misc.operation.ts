import {OPERATION} from './operation.types';
import {Operation} from './operation';


export interface NoOperation extends Operation {
    readonly type: OPERATION.NOP
}

export interface NotImplementedOperation extends Operation {
    readonly type: OPERATION._
}

export interface HLTOperation extends Operation {
    readonly type: OPERATION.HLT
}

export type MiscOperation = NoOperation | HLTOperation | NotImplementedOperation;
