import {Injectable} from "@angular/core";
import {IExecute, OperationT} from "../../core/interface";


@Injectable()
export class ObservableExecute implements IExecute {


    constructor(private instance: IExecute) {
    }

    execute(op: OperationT): void {
        return this.instance.execute(op);
    }


}
