import {Operation} from "../operation";
import {OPERATION} from "../operation.types";
import {BranchOperation} from "./branch.operation";


export interface JumpOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JMP
}

export interface JumpIfNotZeroOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JNZ
}

export interface JumpIfZeroOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JZ

}

export interface JumpIfNotCarryOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JNC

}

export interface JumpIfCarryOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JC

}

export interface JumpIfParityOddOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JPO

}

export interface JumpIfParityEvenOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JPE

}

export interface JumpIfPositiveOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JP

}

export interface JumpIfNegativeOperation extends BranchOperation, Operation {
    readonly type: OPERATION.JM

}

