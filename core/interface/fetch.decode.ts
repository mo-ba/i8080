import {IRegister} from "./register";
import {IMemory} from "./memory";
import {OperationT} from "./operation/operation.all";

export interface IFetchDecode {

    register: IRegister;
    memory: IMemory;

    next(): OperationT;

}
