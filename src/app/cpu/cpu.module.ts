import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TOKEN} from "./tokens";
import {Alu, Decode, Execute, Fetch, Memory, Processor, Register} from "../../core/cpu";
import {ObservableRegister, RegisterStatus} from "./register";
import {ObservableMemory} from "./memory";
import {ObservableFetch} from "./fetch";
import {ObservableDecode} from "./decode";
import {ObservableExecute} from "./execute";
import {IDecode, IExecute, IRegister, OperationT} from "../../core/interface";
import {IFetch} from "../../core/interface/fetch";
import {ObservableProcessor} from "./processor";
import {BehaviorSubject} from "rxjs";
import {Clock} from "./clock";


const OBSERVABLE_TOKENS = [
    {provide: TOKEN.OBSERVABLE.MEMORY, useFactory: () => new BehaviorSubject<Array<Int8Array>>([])},
    {provide: TOKEN.OBSERVABLE.REGISTER, useFactory: () => new BehaviorSubject<RegisterStatus>(null)},
    {provide: TOKEN.OBSERVABLE.DECODE, useFactory: () => new BehaviorSubject<OperationT>(null)},

];
const TOKENS = [
    {provide: TOKEN.MEMORY, useClass: ObservableMemory, deps: [Memory, TOKEN.OBSERVABLE.MEMORY]},
    {provide: TOKEN.REGISTER, useClass: ObservableRegister, deps: [Register, TOKEN.OBSERVABLE.REGISTER]},
    {provide: TOKEN.FETCH, useClass: ObservableFetch, deps: [Fetch]},
    {provide: TOKEN.DECODE, useClass: ObservableDecode, deps: [Decode, TOKEN.OBSERVABLE.DECODE]},
    {provide: TOKEN.EXECUTE, useClass: ObservableExecute, deps: [Execute]},
    {provide: TOKEN.PROCESSOR, useClass: ObservableProcessor, deps: [Processor, Clock]},
]

const processorFactory = (register: IRegister, execute: IExecute, decode: IDecode, fetch: IFetch) =>
    new Processor(register, execute, decode, fetch);

const fetchFactory = (memory, programCounter) =>
    new Fetch(memory, programCounter);

const decodeFactory = (fetch) =>
    new Decode(fetch);

const executeFactory = (register, alu, memory) =>
    new Execute(register, alu, memory);

const registerFactory = (memory) =>
    new Register(memory);

const memoryFactory = () => new Memory();


const processorDeps = [TOKEN.REGISTER, TOKEN.EXECUTE, TOKEN.DECODE, TOKEN.FETCH];
const executeDeps = [TOKEN.REGISTER, Alu, TOKEN.MEMORY];
const fetchDeps = [TOKEN.MEMORY, TOKEN.REGISTER];
const decodeDeps = [TOKEN.FETCH];
const registerDeps = [TOKEN.MEMORY];

const PARTS = [
    Alu,
    {provide: Memory, useFactory: memoryFactory},
    {provide: Register, useFactory: registerFactory, deps: registerDeps},
    {provide: Fetch, useFactory: fetchFactory, deps: fetchDeps},
    {provide: Decode, useFactory: decodeFactory, deps: decodeDeps},
    {provide: Execute, useFactory: executeFactory, deps: executeDeps},
    {provide: Processor, useFactory: processorFactory, deps: processorDeps},
]

@NgModule({
    declarations: [],
    providers: [
        Clock,
        ...PARTS,
        ...OBSERVABLE_TOKENS,
        ...TOKENS
    ],
    imports: [
        CommonModule
    ],
})
export class CpuModule {
}
