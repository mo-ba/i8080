import {Operation} from '../operation';
import {OPERATION} from '../operation.types';
import {BranchToOperation} from './branch.operation';


export interface CallOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CALL
}

export interface CallIfNotZeroOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CNZ
}

export interface CallIfZeroOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CZ

}

export interface CallIfNotCarryOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CNC

}

export interface CallIfCarryOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CC

}

export interface CallIfParityOddOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CPO

}

export interface CallIfParityEvenOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CPE
}

export interface CallIfPositiveOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CP

}

export interface CallIfNegativeOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.CM

}

export type BranchCallOperation =
    CallOperation |
    CallIfNotZeroOperation |
    CallIfZeroOperation |
    CallIfNotCarryOperation |
    CallIfCarryOperation |
    CallIfParityOddOperation |
    CallIfParityEvenOperation |
    CallIfPositiveOperation |
    CallIfNegativeOperation;


