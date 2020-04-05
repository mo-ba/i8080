import {Operation} from "../operation";
import {OPERATION} from "../operation.types";


export interface ReturnOperation extends Operation {
    readonly type: OPERATION.RET
}

export interface ReturnIfNotZeroOperation extends Operation {
    readonly type: OPERATION.RNZ
}

export interface ReturnIfZeroOperation extends Operation {
    readonly type: OPERATION.RZ

}

export interface ReturnIfNotCarryOperation extends Operation {
    readonly type: OPERATION.RNC

}

export interface ReturnIfCarryOperation extends Operation {
    readonly type: OPERATION.RC

}

export interface ReturnIfParityOddOperation extends Operation {
    readonly type: OPERATION.RPO

}

export interface ReturnIfParityEvenOperation extends Operation {
    readonly type: OPERATION.RPE

}

export interface ReturnIfPositiveOperation extends Operation {
    readonly type: OPERATION.RP

}

export interface ReturnIfNegativeOperation extends Operation {
    readonly type: OPERATION.RM

}

export type BranchReturnOperation =
    ReturnOperation |
    ReturnIfNotZeroOperation |
    ReturnIfZeroOperation |
    ReturnIfNotCarryOperation |
    ReturnIfCarryOperation |
    ReturnIfParityOddOperation |
    ReturnIfParityEvenOperation |
    ReturnIfPositiveOperation |
    ReturnIfNegativeOperation;


