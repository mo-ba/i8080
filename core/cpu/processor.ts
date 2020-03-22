import {IMemory} from "../interface/memory";
import {IExecute} from "../interface/execute";
import {IFetchDecode} from "../interface/fetch.decode";
import * as reg from "./register";
import * as fd from "./fetch.decode";
import * as exec from "./execute";
import * as alu from "./alu";
import {IProcessor} from "../interface/processor";
import {IRegister} from "../interface/register";


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


export function build(memory: IMemory): IProcessor {
    const register = reg.build(memory);
    const fetchDecode = fd.build(memory, register);
    const execute = exec.build(register, alu.build(), memory);
    return new Processor(memory, register, execute, fetchDecode)
}
