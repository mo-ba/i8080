import {OperationT} from "./operation/operation.all";

export interface IExecute {

    execute(op: OperationT): void
}
