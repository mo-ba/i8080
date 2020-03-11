import {IExecutor} from "../interface/executor";
import {IRegister, REGISTER} from "../interface/register";
import {IAlu, IAluResult} from "../interface/alu";
import {OPERATION} from "../interface/operation/operation.types";
import {OperationT} from "../interface/operation/operation.all";
import {IFlags} from "../interface/flags";
import {IncOrDecOperation} from "../interface/operation/arithmetic-logic.operation";


class Executor implements IExecutor {

    private readonly register: IRegister;
    private readonly alu: IAlu;


    constructor(register: IRegister, alu: IAlu) {
        this.register = register;
        this.alu = alu;
    }

    private storeSZAP(flags: IFlags) {
        this.register.setSign(flags.sign)
        this.register.setZero(flags.zero)
        this.register.setAuxiliary(flags.aux)
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
                return processAluResult(
                    this.alu.cmp(this.register.load(REGISTER.A), this.register.load(op.register)),
                    (flags) => this.storeAllFlags(flags)
                );
            case OPERATION.CPI:
                return processAluResult(
                    this.alu.cmp(this.register.load(REGISTER.A), op.value),
                    (flags) => this.storeAllFlags(flags)
                );
            case OPERATION.INR:
                return this.processIncOrDec(this.alu.increment(this.register.load(op.register)), op);
            case OPERATION.DCR:
                return this.processIncOrDec(this.alu.decrement(this.register.load(op.register)), op);

            case OPERATION.NOP:
            default:
                return
        }
    }

    private processIncOrDec(result: IAluResult, op: IncOrDecOperation) {
        this.storeSZAP(result.flags);
        this.register.store(op.register, result.result)
        return;
    }
}

export function build(register: IRegister, alu: IAlu): IExecutor {
    return new Executor(register, alu)
}
