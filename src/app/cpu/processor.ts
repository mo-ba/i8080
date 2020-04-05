import {Injectable} from "@angular/core";
import {IProcessor} from "../../core/interface";


@Injectable()
export class ObservableProcessor implements IProcessor {


    constructor(private instance: IProcessor) {

    }

    getStopped(): boolean {
        return this.instance.getStopped();
    }

    next(): void {
        return this.instance.next();
    }
}
