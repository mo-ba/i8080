export enum REGISTER {
    B, C, D, E, H, L, M, A, PSW = 6, SP = 6,
}

export const registerList = [
    REGISTER.B, REGISTER.C, REGISTER.D, REGISTER.E, REGISTER.H, REGISTER.L, REGISTER.M, REGISTER.A
];


export interface HighLow {
    readonly high: number;
    readonly low: number;
}

export interface IHasProgramCounter {

    getProgramCounter(): HighLow

    setProgramCounter(programCounter: HighLow): IRegister
}

export interface IRegister extends IHasProgramCounter {

    load(address: REGISTER): number;

    store(address: REGISTER, value: number): IRegister;

    pop(): HighLow;

    push(value: HighLow): IRegister;


    loadX(address: REGISTER): HighLow;

    storeX(address: REGISTER, value: HighLow): IRegister;


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


    getStackPointer(): HighLow

    setStackPointer(stackPointer: HighLow): IRegister


}
