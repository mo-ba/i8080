import {IFlags, IRegister, IWord, REGISTER} from '../../core/interface';
import {Subject} from 'rxjs';

export interface RegisterStatus {
    [REGISTER.B]: number,
    [REGISTER.C]: number,
    [REGISTER.D]: number,
    [REGISTER.E]: number,
    [REGISTER.H]: number,
    [REGISTER.L]: number,
    [REGISTER.A]: number,
    flags: IFlags
    stackPointer: IWord,
    programCounter: IWord,
}

export class ObservableRegister implements IRegister {


    constructor(private register: IRegister, private subject: Subject<RegisterStatus>) {
        this.emmit(() => {
        });
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
        return this.emmit(() => this.register.push(value));
    }

    setAuxiliary(value: boolean): IRegister {
        return this.emmit(() => this.register.setAuxiliary(value));
    }

    setCarry(value: boolean): IRegister {
        return this.emmit(() => this.register.setCarry(value));
    }

    setParity(value: boolean): IRegister {
        return this.emmit(() => this.register.setParity(value));
    }

    setProgramCounter(programCounter: IWord): IRegister {
        return this.emmit(() => this.register.setProgramCounter(programCounter));
    }

    setSign(value: boolean): IRegister {
        return this.emmit(() => this.register.setSign(value));
    }

    setStackPointer(stackPointer: IWord): IRegister {
        return this.emmit(() => this.register.setStackPointer(stackPointer));
    }

    setStopped(value: boolean): IRegister {
        return this.emmit(() => this.register.setStopped(value));
    }

    setZero(value: boolean): IRegister {
        return this.emmit(() => this.register.setZero(value));
    }

    store(address: REGISTER, value: number): IRegister {
        return this.emmit(() => this.register.store(address, value));
    }

    load(address: REGISTER): number {
        return this.register.load(address);
    }

    storeX(address: REGISTER, value: IWord): IRegister {
        return this.emmit(() => this.register.storeX(address, value));
    }

    toggleCarry(): IRegister {
        return this.emmit(() => this.register.toggleCarry());
    }


    private emmit<E>(fn: () => E) {
        const result = fn();
        this.subject.next(this.buildStatus());
        return result;
    }

    private buildFlagStatus() {
        return {
            carry: this.getCarry(),
            zero: this.getZero(),
            sign: this.getSign(),
            parity: this.getParity(),
            aux: this.getAuxiliary(),
        };
    }

    private buildRegisterStatus() {
        return {
            [REGISTER.B]: this.load(REGISTER.B),
            [REGISTER.C]: this.load(REGISTER.C),
            [REGISTER.D]: this.load(REGISTER.D),
            [REGISTER.E]: this.load(REGISTER.E),
            [REGISTER.H]: this.load(REGISTER.H),
            [REGISTER.L]: this.load(REGISTER.L),
            [REGISTER.A]: this.load(REGISTER.A),
        };
    }

    private buildStatus() {
        return {
            ...this.buildRegisterStatus(),
            flags: this.buildFlagStatus(),
            stackPointer: this.getStackPointer(),
            programCounter: this.getProgramCounter(),
        };
    }
}
