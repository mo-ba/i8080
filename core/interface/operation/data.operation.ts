import {ImmediateValueOperation, LoadFromOperation, Operation, RegisterOperation, StoreToOperation} from "./operation";
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

export type DataOperation =
    MoveOperation |
    MoveImmediateOperation |
    PushOperation |
    PopOperation;
