import {Operation} from '../operation';
import {OPERATION} from '../operation.types';
import {BranchToOperation} from './branch.operation';


export interface JumpOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JMP
}

export interface JumpIfNotZeroOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JNZ
}

export interface JumpIfZeroOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JZ

}

export interface JumpIfNotCarryOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JNC

}

export interface JumpIfCarryOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JC

}

export interface JumpIfParityOddOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JPO

}

export interface JumpIfParityEvenOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JPE

}

export interface JumpIfPositiveOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JP

}

export interface JumpIfNegativeOperation extends BranchToOperation, Operation {
    readonly type: OPERATION.JM

}

export interface LoadProgramCounterOperation extends Operation {
    readonly type: OPERATION.PCHL

}


export type BranchJumpOperation =
    LoadProgramCounterOperation |
    JumpOperation |
    JumpIfNotZeroOperation |
    JumpIfZeroOperation |
    JumpIfNotCarryOperation |
    JumpIfCarryOperation |
    JumpIfParityOddOperation |
    JumpIfParityEvenOperation |
    JumpIfPositiveOperation |
    JumpIfNegativeOperation;


