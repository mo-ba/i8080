import { Operation} from "../operation";
import {OPERATION} from "../operation.types";
import {BranchOperation} from "./branch.operation";


export interface CallOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CALL
}

export interface CallIfNotZeroOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CNZ
}

export interface CallIfZeroOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CZ

}

export interface CallIfNotCarryOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CNC

}

export interface CallIfCarryOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CC

}

export interface CallIfParityOddOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CPO

}

export interface CallIfParityEvenOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CPE
}

export interface CallIfPositiveOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CP

}

export interface CallIfNegativeOperation extends BranchOperation, Operation {
    readonly type: OPERATION.CM

}
