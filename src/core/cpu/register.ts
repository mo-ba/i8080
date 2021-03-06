import {IMemory, IRegister, IWord, REGISTER} from '../interface';
import {BYTE_MAX, highLow, toHighLow, xDecrement, xIncrement} from '../util';


enum FLAG_INDEX {
    Carry,      // - Carry Flag
    AlwaysOne,  // - Not used, always one
    Parity,     // - Parity Flag
    AlwaysZERO, // - Not used, always zero
    Auxiliary,  // - also called AC, Auxiliary Carry Flag
    NotUsed,    // - Not used, always zero
    Zero,       // - Zero Flag
    Sign,       // - Sign Flag
}

enum FLAG_BIT {
    Carry = 1 << FLAG_INDEX.Carry,
    AlwaysOne = 1 << FLAG_INDEX.AlwaysOne,
    Parity = 1 << FLAG_INDEX.Parity,
    AlwaysZERO = 1 << FLAG_INDEX.AlwaysZERO,
    Auxiliary = 1 << FLAG_INDEX.Auxiliary,
    NotUsed = 1 << FLAG_INDEX.NotUsed,
    Zero = 1 << FLAG_INDEX.Zero,
    Sign = 1 << FLAG_INDEX.Sign,
}

enum PATTERN {
    NOT = -1,
    FLAGS = FLAG_BIT.Auxiliary | FLAG_BIT.Parity | FLAG_BIT.Carry | FLAG_BIT.Sign | FLAG_BIT.Zero
}

const map16bitRead: { [addr: number]: (reg: Int8Array, flag: number) => IWord } = {
    [REGISTER.PSW]: (r: Int8Array, flags: number) => ({high: r[REGISTER.A] & BYTE_MAX, low: flags,}),
    [REGISTER.B]: (r: Int8Array) => ({high: r[REGISTER.B] & BYTE_MAX, low: r[REGISTER.C] & BYTE_MAX,}),
    [REGISTER.D]: (r: Int8Array) => ({high: r[REGISTER.D] & BYTE_MAX, low: r[REGISTER.E] & BYTE_MAX,}),
    [REGISTER.H]: (r: Int8Array) => ({high: r[REGISTER.H] & BYTE_MAX, low: r[REGISTER.L] & BYTE_MAX,}),
};

const map16bitStore: { [addr: number]: (reg: Register, values: IWord) => Register } = {
    [REGISTER.PSW]: (r: Register, v: IWord) => r.store(REGISTER.A, v.high).setFlags(PATTERN.FLAGS & v.low),
    [REGISTER.B]: (r: Register, v: IWord) => r.store(REGISTER.B, v.high).store(REGISTER.C, v.low),
    [REGISTER.D]: (r: Register, v: IWord) => r.store(REGISTER.D, v.high).store(REGISTER.E, v.low),
    [REGISTER.H]: (r: Register, v: IWord) => r.store(REGISTER.H, v.high).store(REGISTER.L, v.low),
};


export class Register implements IRegister {

    private registers = Int8Array.of(0, 0, 0, 0, 0, 0, 0, 0);
    private flags = 0;

    private stackPointer: IWord;
    private programCounter: IWord;
    private isStopped = false;

    constructor(private readonly memory: IMemory) {
        this.stackPointer = toHighLow(0xffff);
        this.programCounter = toHighLow(0);
    }


    load(address: REGISTER): number {
        if (address === REGISTER.M) {
            return this.loadMemory(this.getAddressFromHighLow());
        } else {
            return this.registers[address] & BYTE_MAX;
        }
    }


    loadX(address: REGISTER): IWord {
        return map16bitRead[address](this.registers, this.flags);
    }

    store(address: REGISTER, value: number): Register {
        if (address === REGISTER.M) {
            return this.storeMemory(this.getAddressFromHighLow(), value);
        }
        this.registers[address] = value;
        return this;
    }


    setFlags(flags: number): Register {
        this.flags = flags;
        return this;
    }

    storeX(address: REGISTER, value: IWord): Register {
        return map16bitStore[address](this, value);
    }


    setAuxiliary(value: boolean): Register {
        return this.setFlag(value, FLAG_BIT.Auxiliary);
    }

    setCarry(value: boolean): Register {
        return this.setFlag(value, FLAG_BIT.Carry);
    }

    setParity(value: boolean): Register {
        return this.setFlag(value, FLAG_BIT.Parity);
    }

    setSign(value: boolean): Register {
        return this.setFlag(value, FLAG_BIT.Sign);
    }

    setZero(value: boolean): Register {
        return this.setFlag(value, FLAG_BIT.Zero);
    }

    toggleCarry(): Register {
        this.flags = FLAG_BIT.Carry ^ this.flags;
        return this;
    }


    getAuxiliary(): boolean {
        return !!(this.flags & FLAG_BIT.Auxiliary);
    }

    getCarry(): boolean {
        return !!(this.flags & FLAG_BIT.Carry);
    }

    getParity(): boolean {
        return !!(this.flags & FLAG_BIT.Parity);
    }

    getSign(): boolean {
        return !!(this.flags & FLAG_BIT.Sign);
    }

    getZero(): boolean {
        return !!(this.flags & FLAG_BIT.Zero);
    }


    pop(): IWord {
        const low = this.incrementStackPointer()
            .loadMemory(this.stackPointer);
        const high = this.incrementStackPointer()
            .loadMemory(this.stackPointer);
        return {high, low};
    }

    push(value: IWord): IRegister {
        return this
            .storeMemory(this.stackPointer, value.high)
            .decrementStackPointer()
            .storeMemory(this.stackPointer, value.low)
            .decrementStackPointer();

    }

    getProgramCounter(): IWord {
        return this.programCounter;
    }

    getStackPointer(): IWord {
        return this.stackPointer;
    }


    setProgramCounter(value: IWord): IRegister {
        this.programCounter = value;
        return this;
    }

    setStackPointer(stackPointer: IWord): IRegister {
        this.stackPointer = stackPointer;
        return this;
    }

    getStopped(): boolean {
        return this.isStopped;
    }

    setStopped(value: boolean): IRegister {
        this.isStopped = value;
        return this;
    }

    private loadMemory(address: IWord) {
        return this.memory.load(address);
    }

    private getAddressFromHighLow() {
        return highLow(
            this.registers[REGISTER.H] & BYTE_MAX,
            this.registers[REGISTER.L] & BYTE_MAX
        );
    }

    private storeMemory(address: IWord, value: number): Register {
        this.memory.store(address, value);
        return this;
    }

    private setFlag(value: boolean, flag: FLAG_BIT): Register {

        this.flags = value ? flag | this.flags : (flag ^ PATTERN.NOT) & this.flags;
        return this;
    }

    private decrementStackPointer() {
        this.stackPointer = xDecrement(this.stackPointer);
        return this;
    }

    private incrementStackPointer() {
        this.stackPointer = xIncrement(this.stackPointer);
        return this;
    }
}
