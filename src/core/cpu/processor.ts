import {IExecute, IFetchDecode, IMemory, IProcessor, IRegister} from "../interface";
import {Register} from "./register";
import {FetchDecode} from "./fetch.decode";
import {Alu} from "./alu";
import {Execute} from "./execute";


export class Processor implements IProcessor {
    constructor(
        private readonly memory: IMemory,
        private readonly register: IRegister,
        private readonly execute: IExecute,
        private readonly fetchDecode: IFetchDecode,
    ) {
    }

    next() {
        const op = this.fetchDecode.next()
        this.execute.execute(op);
    }

    getStopped(): boolean {
        return this.register.getStopped();
    }

}
