import {Injectable} from "@angular/core";
import {IDecode, OperationT} from "../../core/interface";

@Injectable()
export class ObservableDecode implements IDecode {


    constructor(private instance: IDecode) {

    }

    decode(opCode: number): OperationT {
        return this.instance.decode(opCode);
    }
}
