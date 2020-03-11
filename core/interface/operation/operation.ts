import {REGISTER} from "../register";
import {OPERATION} from "./operation.types";


export interface Operation {
    readonly type: OPERATION;
}

export interface ImmediateValueOperation {
    value: number;
}

export interface StoreToOperation {
    to: REGISTER;
}

export interface LoadFromOperation {
    from: REGISTER;
}

export interface RegisterOperation {
    register: REGISTER;
}
