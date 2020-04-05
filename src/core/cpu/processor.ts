import {IDecode, IExecute, IProcessor, IRegister} from "../interface";
import {IFetch} from "../interface/fetch";


export class Processor implements IProcessor {
    constructor(
        private readonly register: IRegister,
        private readonly execute: IExecute,
        private readonly decode: IDecode,
        private readonly fetch: IFetch,
    ) {
    }

    next() {
        const code = this.fetch.fetch();
        const instruction = this.decode.decode(code);
        this.execute.execute(instruction);
    }

    getStopped(): boolean {
        return this.register.getStopped();
    }

}
