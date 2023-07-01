import {IWord} from './word';
import {IProgramCounter} from './program-counter';

export enum REGISTER {
    B, C, D, E, H, L, M, A, PSW = 6, SP = 6,
}

export const registerList = [
    REGISTER.B, REGISTER.C, REGISTER.D, REGISTER.E, REGISTER.H, REGISTER.L, REGISTER.M, REGISTER.A
];

export const registerName = [
    'B', 'C', 'D', 'E', 'H', 'L', 'M', 'A'
];

export interface IRegister extends IProgramCounter {

    load(address: REGISTER): number;

    store(address: REGISTER, value: number): IRegister;

    pop(): IWord;

    push(value: IWord): IRegister;


    loadX(address: REGISTER): IWord;

    storeX(address: REGISTER, value: IWord): IRegister;


    setCarry(value: boolean): IRegister;

    getCarry(): boolean;

    toggleCarry(): IRegister;


    setAuxiliary(value: boolean): IRegister;

    getAuxiliary(): boolean;


    setParity(value: boolean): IRegister;

    getParity(): boolean;


    setSign(value: boolean): IRegister;

    getSign(): boolean;


    setZero(value: boolean): IRegister;

    getZero(): boolean;

    setStopped(value: boolean): IRegister;

    getStopped(): boolean;


    getStackPointer(): IWord;

    setStackPointer(stackPointer: IWord): IRegister;


    getProgramCounter(): IWord;

    setProgramCounter(programCounter: IWord): IRegister;
}
