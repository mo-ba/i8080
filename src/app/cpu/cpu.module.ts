import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TOKEN} from "./tokens";
import {Alu, Decode, Execute, Fetch, Memory, Processor, Register} from "../../core/cpu";
import {ObservableRegister} from "./register";
import {ObservableMemory} from "./memory";
import {ObservableFetch} from "./fetch";
import {ObservableDecode} from "./decode";
import {ObservableExecute} from "./execute";
import {IDecode, IExecute, IRegister} from "../../core/interface";
import {IFetch} from "../../core/interface/fetch";
import {ObservableProcessor} from "./processor";


const registerFactory = (register: IRegister, execute: IExecute, decode: IDecode, fetch: IFetch) =>
    new Processor(register, execute, decode, fetch);

@NgModule({
    declarations: [],
    providers: [
        Alu,

        {
            provide: Memory,
            useFactory: () => new Memory()
        },
        {provide: TOKEN.MEMORY, useClass: ObservableMemory, deps: [Memory]},

        {
            provide: Register,
            useFactory: (memory) => new Register(memory), deps: [TOKEN.MEMORY]
        },
        {provide: TOKEN.REGISTER, useClass: ObservableRegister, deps: [Register]},

        {
            provide: Fetch,
            useFactory: (memory, pc) => new Fetch(memory, pc), deps: [TOKEN.MEMORY, TOKEN.REGISTER]
        },
        {provide: TOKEN.FETCH, useClass: ObservableFetch, deps: [Fetch]},

        {
            provide: Decode,
            useFactory: (fetch) => new Decode(fetch), deps: [TOKEN.FETCH]
        },
        {provide: TOKEN.DECODE, useClass: ObservableDecode, deps: [Decode]},

        {
            provide: Execute,
            useFactory: (register, alu, memory) => new Execute(register, alu, memory),
            deps: [TOKEN.REGISTER, Alu, TOKEN.MEMORY,]
        },
        {provide: TOKEN.EXECUTE, useClass: ObservableExecute, deps: [Execute]},


        {
            provide: Processor,
            useFactory: registerFactory,
            deps: [TOKEN.REGISTER, TOKEN.EXECUTE, TOKEN.DECODE, TOKEN.FETCH,]
        },
        {provide: TOKEN.PROCESSOR, useClass: ObservableProcessor, deps: [Processor]},
    ],
    imports: [
        CommonModule
    ],
})
export class CpuModule {
}
