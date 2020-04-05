import {REGISTER} from "../register";
import {IWord} from "../word";
import {OPERATION} from "./operation.types";


export interface Operation {
    readonly type: OPERATION;
}

export interface ImmediateValueOperation {
    value: number;
}

export interface ImmediateHighLowValueOperation {
    value: IWord;
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
