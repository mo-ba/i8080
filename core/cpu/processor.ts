import {IExecute, IFetchDecode, IMemory, IProcessor, IRegister} from "../interface";
import {buildRegister} from "./register";
import {buildFetch} from "./fetch.decode";
import {buildExecute} from "./execute";
import {buildAlu} from "./alu";


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
    const register = buildRegister(memory);
    const fetchDecode = buildFetch(memory, register);
    const execute = buildExecute(register, buildAlu(), memory);
    return new Processor(memory, register, execute, fetchDecode)
}

