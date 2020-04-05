import {
    ImmediateHighLowValueOperation,
    ImmediateValueOperation,
    LoadFromOperation,
    Operation,
    RegisterOperation,
    StoreToOperation
} from "./operation";
import {OPERATION} from "./operation.types";

export interface MoveOperation extends LoadFromOperation, StoreToOperation, Operation {
    readonly type: OPERATION.MOV;
}

export interface MoveImmediateOperation extends StoreToOperation, ImmediateValueOperation, Operation {
    readonly type: OPERATION.MVI;
}

export interface PushOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.PUSH;
}

export interface PopOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.POP;
}
export interface LoadRegisterPairImmediateOperation extends RegisterOperation, ImmediateHighLowValueOperation, Operation {
    readonly type: OPERATION.LXI;
}
export interface LoadAccumulatorOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.LDAX;
}
export interface StoreAccumulatorOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.STAX;
}

export interface LoadAccumulatorDirectOperation extends ImmediateHighLowValueOperation, Operation {
    readonly type: OPERATION.LDA;
}
export interface StoreAccumulatorDirectOperation extends ImmediateHighLowValueOperation, Operation {
    readonly type: OPERATION.STA;
}
export interface StoreHLDirect extends ImmediateHighLowValueOperation, Operation {
    readonly type: OPERATION.SHLD;
}
export interface LoadHLDirect extends ImmediateHighLowValueOperation, Operation {
    readonly type: OPERATION.LHLD;
}

export interface ExchangeStack extends Operation {
    readonly type: OPERATION.XTHL;
}

export interface ExchangeRegisters extends  Operation {
    readonly type: OPERATION.XCHG;
}

export interface LoadSPFromHL extends  Operation {
    readonly type: OPERATION.SPHL;
}

export type DataOperation =
    MoveOperation |
    MoveImmediateOperation |
    LoadAccumulatorOperation |
    LoadAccumulatorDirectOperation |
    LoadHLDirect |
    StoreAccumulatorOperation |
    StoreAccumulatorDirectOperation |
    StoreHLDirect |
    ExchangeStack |
    ExchangeRegisters |
    LoadSPFromHL |
    LoadRegisterPairImmediateOperation |
    PushOperation |
    PopOperation;
