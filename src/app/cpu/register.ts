import {IRegister, IWord, REGISTER} from "../../core/interface";

export class ObservableRegister implements IRegister {


    constructor(private register: IRegister) {

    }

    getAuxiliary(): boolean {
        return this.register.getAuxiliary();
    }

    getCarry(): boolean {
        return this.register.getCarry();
    }

    getParity(): boolean {
        return this.register.getParity();
    }

    getProgramCounter(): IWord {
        return this.register.getProgramCounter();
    }

    getSign(): boolean {
        return this.register.getSign();
    }

    getStackPointer(): IWord {
        return this.register.getStackPointer();
    }

    getStopped(): boolean {
        return this.register.getStopped();
    }

    getZero(): boolean {
        return this.register.getZero();
    }

    loadX(address: REGISTER): IWord {
        return this.register.loadX(address);
    }

    pop(): IWord {
        return this.register.pop();
    }

    push(value: IWord): IRegister {
        return this.register.push(value);
    }

    setAuxiliary(value: boolean): IRegister {
        return this.register.setAuxiliary(value);
    }

    setCarry(value: boolean): IRegister {
        return this.register.setCarry(value);
    }

    setParity(value: boolean): IRegister {
        return this.register.setParity(value);
    }

    setProgramCounter(programCounter: IWord): IRegister {
        return this.register.setProgramCounter(programCounter);
    }

    setSign(value: boolean): IRegister {
        return this.register.setSign(value);
    }

    setStackPointer(stackPointer: IWord): IRegister {
        return this.register.setStackPointer(stackPointer);
    }

    setStopped(value: boolean): IRegister {
        return this.register.setStopped(value);
    }

    setZero(value: boolean): IRegister {
        return this.register.setZero(value);
    }

    store(address: REGISTER, value: number): IRegister {
        return this.register.store(address, value);
    }

    load(address: REGISTER): number {
        return this.register.load(address);
    }

    storeX(address: REGISTER, value: IWord): IRegister {
        return this.register.storeX(address, value)
    }

    toggleCarry(): IRegister {
        return this.register.toggleCarry();
    }


}
