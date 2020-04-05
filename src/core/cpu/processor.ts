import {IExecute, IFetchDecode, IMemory, IProcessor, IRegister} from "../interface";
import {Register} from "./register";
import {FetchDecode} from "./fetch.decode";
import {buildExecute} from "./execute";
import {Alu} from "./alu";


class Processor implements IProcessor {
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


export function buildProcessor(memory: IMemory): IProcessor {
    const register = new Register(memory);
    const fetchDecode = new FetchDecode(memory, register);
    const execute = buildExecute(register, new Alu(), memory);
    return new Processor(memory, register, execute, fetchDecode)
}

