import {OperationT} from "./operation/operation.all";

export interface IFetchDecode {
    next(): OperationT;
}
