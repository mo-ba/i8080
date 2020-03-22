import {IExecute} from "../interface/execute";
import {HighLow, IRegister, REGISTER} from "../interface/register";
import {IAlu, IAluResult, IXAluResult} from "../interface/alu";
import {OPERATION} from "../interface/operation/operation.types";
import {OperationT} from "../interface/operation/operation.all";
import {IFlags} from "../interface/flags";
import {IncOrDecOperation} from "../interface/operation/arithmetic-logic.operation";
import {BYTE_MAX} from "../util/bits";
import {IMemory} from "../interface/memory";
import {xIncrement} from "../util/arithmetic";
import {BranchToOperation} from "../interface/operation/branch/branch.operation";

export const XCMAP: { [n: string]: number } = {};
for (let o in OPERATION) {
    XCMAP[o] = 0
}


class Execute implements IExecute {


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
        XCMAP[op.type]++;

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
                return ((oldHL: HighLow) => {
                    this.register.store(REGISTER.L, this.memory.load(this.register.getStackPointer()));
                    this.register.store(REGISTER.H, this.memory.load(xIncrement(this.register.getStackPointer())));

                    this.memory.store(this.register.getStackPointer(), oldHL.low);
                    this.memory.store(xIncrement(this.register.getStackPointer()), oldHL.high);
                })(this.register.loadX(REGISTER.H));


            case OPERATION.XCHG:
                return ((oldHL: HighLow) => {
                    this.register.storeX(REGISTER.H, this.register.loadX(REGISTER.D));
                    this.register.storeX(REGISTER.D, oldHL);

                })(this.register.loadX(REGISTER.H));


            case OPERATION.SPHL:
                this.register.setStackPointer(this.register.loadX(REGISTER.H));
                return;


            case OPERATION.PCHL:
                this.jumpToPosition(this.register.loadX(REGISTER.H));
                return;


            case OPERATION.JMP:
                this.jump(op);
                return;


            case OPERATION.JNZ:
                this.ifNotZero(() => this.jump(op));
                return;

            case OPERATION.JZ:
                this.ifZero(() => this.jump(op));
                return;


            case OPERATION.JNC:
                this.ifNotCarry(() => this.jump(op));
                return;

            case OPERATION.JC:
                this.ifCarry(() => this.jump(op));
                return;

            case OPERATION.JPE:
                this.ifParityEven(() => this.jump(op));
                return;

            case OPERATION.JPO:
                this.ifParityOdd(() => this.jump(op));
                return;

            case OPERATION.JP:
                this.ifPositive(() => this.jump(op));
                return;

            case OPERATION.JM:
                this.ifNegative(() => this.jump(op));
                return;

            case OPERATION.CALL:
                this.call(op);
                return;


            case OPERATION.CNZ:
                this.ifNotZero(() => this.call(op));
                return;


            case OPERATION.CZ:
                this.ifZero(() => this.call(op));
                return;


            case OPERATION.CNC:
                this.ifNotCarry(() => this.call(op));
                return;

            case OPERATION.CC:
                this.ifCarry(() => this.call(op));
                return;

            case OPERATION.CPE:
                this.ifParityEven(() => this.call(op));
                return;

            case OPERATION.CPO:
                this.ifParityOdd(() => this.call(op));
                return;

            case OPERATION.CP:
                this.ifPositive(() => this.call(op));
                return;

            case OPERATION.CM:
                this.ifNegative(() => this.call(op));
                return;


            case OPERATION.RET:
                this.returnTo();
                return;


            case OPERATION.RNZ:
                this.ifNotZero(() => this.returnTo());
                return;


            case OPERATION.RZ:
                this.ifZero(() => this.returnTo());
                return;


            case OPERATION.RNC:
                this.ifNotCarry(() => this.returnTo());
                return;

            case OPERATION.RC:
                this.ifCarry(() => this.returnTo());
                return;

            case OPERATION.RPE:
                this.ifParityEven(() => this.returnTo());
                return;

            case OPERATION.RPO:
                this.ifParityOdd(() => this.returnTo());
                return;

            case OPERATION.RP:
                this.ifPositive(() => this.returnTo());
                return;

            case OPERATION.RM:
                this.ifNegative(() => this.returnTo());
                return;


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


    private jumpToPosition(position: HighLow) {
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

    private store16BitValue(register: REGISTER, value: HighLow) {
        return register === REGISTER.SP ? this.register.setStackPointer(value) : this.register.storeX(register, value)
    }

    private processIncOrDec(result: IAluResult, op: IncOrDecOperation) {
        this.storeSZAP(result.flags);
        this.register.store(op.register, result.result);
        return;
    }
}

export function build(register: IRegister, alu: IAlu, memory: IMemory): IExecute {
    return new Execute(register, alu, memory)
}
