import {
    BranchToOperation,
    IAlu,
    IAluResult,
    IExecute,
    IFlags,
    IMemory,
    IncOrDecOperation,
    IRegister,
    IWord,
    IXAluResult,
    OPERATION,
    OperationT,
    REGISTER
} from "../interface";
import {BYTE_MAX, xIncrement} from "../util";

export class Execute implements IExecute {


    constructor(private readonly register: IRegister,
                private readonly alu: IAlu,
                private readonly memory: IMemory) {
    }

    private storeSZAP(flags: IFlags) {
        this.register.setSign(flags.sign);
        this.register.setZero(flags.zero);
        this.register.setAuxiliary(flags.aux);
        this.register.setParity(flags.parity)
    }

    private storeCarry(flags: IFlags) {
        this.register.setCarry(flags.carry)
    }

    private storeAllFlags(flags: IFlags) {
        this.storeCarry(flags);
        this.storeSZAP(flags);
    }


    execute(op: OperationT): void {
        const processAluResult = (result: IAluResult, flags: (flags: IFlags) => void) => {
            this.register.store(REGISTER.A, result.result);
            flags(result.flags)
        };

        switch (op.type) {
            case OPERATION.MOV:
                this.register.store(op.to, this.register.load(op.from));
                return;

            case OPERATION.MVI:
                this.register.store(op.to, op.value);
                return;

            case OPERATION.PUSH:
                this.register.push(this.register.loadX(op.register));
                return;

            case OPERATION.POP:
                this.register.storeX(op.register, this.register.pop());
                return;

            case OPERATION.ADD:
                return processAluResult(
                    this.alu.add(this.register.load(REGISTER.A), this.register.load(op.register)),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ADI:
                return processAluResult(
                    this.alu.add(this.register.load(REGISTER.A), op.value),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ADC:
                return processAluResult(
                    this.alu.adc(this.register.load(REGISTER.A), this.register.load(op.register), this.register.getCarry()),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ACI:
                return processAluResult(
                    this.alu.adc(this.register.load(REGISTER.A), op.value, this.register.getCarry()),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.SUB:
                return processAluResult(
                    this.alu.sub(this.register.load(REGISTER.A), this.register.load(op.register)),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.SUI:
                return processAluResult(
                    this.alu.sub(this.register.load(REGISTER.A), op.value),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.SBB:
                return processAluResult(
                    this.alu.sbb(this.register.load(REGISTER.A), this.register.load(op.register), this.register.getCarry()),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.SBI:
                return processAluResult(
                    this.alu.sbb(this.register.load(REGISTER.A), op.value, this.register.getCarry()),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ORA:
                return processAluResult(
                    this.alu.or(this.register.load(REGISTER.A), this.register.load(op.register)),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ORI:
                return processAluResult(
                    this.alu.or(this.register.load(REGISTER.A), op.value),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.XRA:
                return processAluResult(
                    this.alu.xor(this.register.load(REGISTER.A), this.register.load(op.register)),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.XRI:
                return processAluResult(
                    this.alu.xor(this.register.load(REGISTER.A), op.value),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ANA:
                return processAluResult(
                    this.alu.and(this.register.load(REGISTER.A), this.register.load(op.register)),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.ANI:
                return processAluResult(
                    this.alu.and(this.register.load(REGISTER.A), op.value),
                    (flags) => this.storeAllFlags(flags)
                );

            case OPERATION.CMP:
                this.storeAllFlags(this.alu.cmp(this.register.load(REGISTER.A), this.register.load(op.register)).flags);
                return;

            case OPERATION.CPI:
                this.storeAllFlags(this.alu.cmp(this.register.load(REGISTER.A), op.value).flags);
                return;

            case OPERATION.DAA:
                return processAluResult(
                    this.alu.decimalAdjustAccumulator(this.register.load(REGISTER.A), this.register.getCarry(), this.register.getAuxiliary()),
                    (flags) => this.storeAllFlags(flags)
                );
            case OPERATION.CMC:
                this.register.setCarry(!this.register.getCarry());
                return;

            case OPERATION.STC:
                this.register.setCarry(true);
                return;

            case OPERATION.CMA:
                this.register.store(REGISTER.A, this.register.load(REGISTER.A) ^ BYTE_MAX);
                return;

            case OPERATION.INR:
                return this.processIncOrDec(this.alu.increment(this.register.load(op.register)), op);

            case OPERATION.DCR:
                return this.processIncOrDec(this.alu.decrement(this.register.load(op.register)), op);

            case OPERATION.RLC:
                return processAluResult(
                    this.alu.rotateLeft(this.register.load(REGISTER.A)),
                    (flags) => this.storeCarry(flags)
                );

            case OPERATION.RRC:
                return processAluResult(
                    this.alu.rotateRight(this.register.load(REGISTER.A)),
                    (flags) => this.storeCarry(flags)
                );

            case OPERATION.RAL:
                return processAluResult(
                    this.alu.rotateLeftThroughCarry(this.register.load(REGISTER.A), this.register.getCarry()),
                    (flags) => this.storeCarry(flags)
                );

            case OPERATION.RAR:
                return processAluResult(
                    this.alu.rotateRightThroughCarry(this.register.load(REGISTER.A), this.register.getCarry()),
                    (flags) => this.storeCarry(flags)
                );

            case OPERATION.DAD:
                return ((result: IXAluResult) => {
                    this.store16BitValue(REGISTER.H, result.result);
                    this.storeCarry(result.flags)
                })(this.alu.xAdd(this.register.loadX(REGISTER.H), this.load16BitValue(op.register)));

            case OPERATION.INX:
                return ((result: IXAluResult) => {
                    this.store16BitValue(op.register, result.result);
                })(this.alu.xIncrement(this.load16BitValue(op.register)));

            case OPERATION.DCX:
                return ((result: IXAluResult) => {
                    this.store16BitValue(op.register, result.result);
                })(this.alu.xDecrement(this.load16BitValue(op.register)));

            case OPERATION.LXI:
                this.store16BitValue(op.register, op.value);
                return;

            case OPERATION.LDAX:
                this.register.store(REGISTER.A, this.memory.load(this.register.loadX(op.register)));
                return;

            case OPERATION.LDA:
                this.register.store(REGISTER.A, this.memory.load(op.value));
                return;

            case OPERATION.STAX:
                this.memory.store(this.register.loadX(op.register), this.register.load(REGISTER.A));
                return;

            case OPERATION.STA:
                this.memory.store(op.value, this.register.load(REGISTER.A));
                return;

            case OPERATION.SHLD:
                this.memory.store(op.value, this.register.load(REGISTER.L));
                this.memory.store(xIncrement(op.value), this.register.load(REGISTER.H));
                return;

            case OPERATION.LHLD:
                this.register.store(REGISTER.L, this.memory.load(op.value));
                this.register.store(REGISTER.H, this.memory.load(xIncrement(op.value)));
                return;

            case OPERATION.XTHL:
                return ((oldHL: IWord) => {
                    this.register.store(REGISTER.L, this.memory.load(this.register.getStackPointer()));
                    this.register.store(REGISTER.H, this.memory.load(xIncrement(this.register.getStackPointer())));

                    this.memory.store(this.register.getStackPointer(), oldHL.low);
                    this.memory.store(xIncrement(this.register.getStackPointer()), oldHL.high);
                })(this.register.loadX(REGISTER.H));

            case OPERATION.XCHG:
                return ((oldHL: IWord) => {
                    this.register.storeX(REGISTER.H, this.register.loadX(REGISTER.D));
                    this.register.storeX(REGISTER.D, oldHL);

                })(this.register.loadX(REGISTER.H));

            case OPERATION.SPHL:
                this.register.setStackPointer(this.register.loadX(REGISTER.H));
                return;

            case OPERATION.PCHL:
                return this.jumpToPosition(this.register.loadX(REGISTER.H));

            case OPERATION.JMP:
                return this.jump(op);

            case OPERATION.JNZ:
                return this.ifNotZero(() => this.jump(op));

            case OPERATION.JZ:
                return this.ifZero(() => this.jump(op));

            case OPERATION.JNC:
                return this.ifNotCarry(() => this.jump(op));

            case OPERATION.JC:
                return this.ifCarry(() => this.jump(op));

            case OPERATION.JPE:
                return this.ifParityEven(() => this.jump(op));

            case OPERATION.JPO:
                return this.ifParityOdd(() => this.jump(op));

            case OPERATION.JP:
                return this.ifPositive(() => this.jump(op));

            case OPERATION.JM:
                return this.ifNegative(() => this.jump(op));

            case OPERATION.CALL:
                return this.call(op);

            case OPERATION.CNZ:
                return this.ifNotZero(() => this.call(op));

            case OPERATION.CZ:
                return this.ifZero(() => this.call(op));

            case OPERATION.CNC:
                return this.ifNotCarry(() => this.call(op));

            case OPERATION.CC:
                return this.ifCarry(() => this.call(op));

            case OPERATION.CPE:
                return this.ifParityEven(() => this.call(op));

            case OPERATION.CPO:
                return this.ifParityOdd(() => this.call(op));

            case OPERATION.CP:
                return this.ifPositive(() => this.call(op));

            case OPERATION.CM:
                return this.ifNegative(() => this.call(op));

            case OPERATION.RET:
                return this.returnTo();

            case OPERATION.RNZ:
                return this.ifNotZero(() => this.returnTo());

            case OPERATION.RZ:
                return this.ifZero(() => this.returnTo());

            case OPERATION.RNC:
                return this.ifNotCarry(() => this.returnTo());

            case OPERATION.RC:
                return this.ifCarry(() => this.returnTo());

            case OPERATION.RPE:
                return this.ifParityEven(() => this.returnTo());

            case OPERATION.RPO:
                return this.ifParityOdd(() => this.returnTo());

            case OPERATION.RP:
                return this.ifPositive(() => this.returnTo());

            case OPERATION.RM:
                return this.ifNegative(() => this.returnTo());

            case OPERATION.HLT:
                this.register.setStopped(true)
                return;

            case OPERATION.NOP:
            default:
                return
        }
    }

    private ifPositive(jump: () => void) {
        if (!this.register.getSign()) {
            jump();
        }
    }

    private ifNegative(jump: () => void) {
        if (this.register.getSign()) {
            jump();
        }
    }

    private ifParityEven(jump: () => void) {
        if (!this.register.getParity()) {
            jump();
        }
    }

    private ifParityOdd(jump: () => void) {
        if (this.register.getParity()) {
            jump();
        }
    }

    private ifNotCarry(jump: () => void) {
        if (!this.register.getCarry()) {
            jump();
        }
    }

    private ifCarry(jump: () => void) {
        if (this.register.getCarry()) {
            jump();
        }
    }

    private ifNotZero(jump: () => void) {
        if (!this.register.getZero()) {
            jump();
        }
    }

    private ifZero(jump: () => void) {
        if (this.register.getZero()) {
            jump();
        }
    }

    private jump(op: BranchToOperation) {
        this.jumpToPosition(op.position);
    }


    private jumpToPosition(position: IWord) {
        this.register.setProgramCounter(position);
    }

    private returnTo() {
        this.jumpToPosition(this.register.pop());
    }

    private call(op: BranchToOperation) {
        this.register.push(this.register.getProgramCounter())
        this.jumpToPosition(op.position);
    }

    private load16BitValue(register: REGISTER) {
        return register === REGISTER.SP ? this.register.getStackPointer() : this.register.loadX(register)
    }

    private store16BitValue(register: REGISTER, value: IWord) {
        return register === REGISTER.SP ? this.register.setStackPointer(value) : this.register.storeX(register, value)
    }

    private processIncOrDec(result: IAluResult, op: IncOrDecOperation) {
        this.storeSZAP(result.flags);
        this.register.store(op.register, result.result);
        return;
    }
}
