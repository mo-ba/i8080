import {OperationT} from "./operation/operation.all";

export interface IExecutor {

    execute(op: OperationT): void
}
