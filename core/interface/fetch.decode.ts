import {OperationT} from "./operation";

export interface IFetchDecode {
    next(): OperationT;
}
