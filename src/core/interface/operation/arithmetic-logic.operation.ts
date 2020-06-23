import {ImmediateValueOperation, Operation, RegisterOperation} from './operation';
import {OPERATION} from './operation.types';

export interface AddOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.ADD;
}

export interface AdcOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.ADC;
}

export interface SubOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.SUB;
}

export interface SbbOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.SBB;
}

export interface AnaOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.ANA;
}

export interface XraOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.XRA;
}

export interface OraOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.ORA;
}

export interface CmpOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.CMP;
}


export interface AddImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.ADI;
}

export interface AdcImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.ACI;
}

export interface SubImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.SUI;
}

export interface SbbImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.SBI;
}

export interface AnaImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.ANI;
}

export interface XraImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.XRI;
}

export interface OraImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.ORI;
}

export interface CmpImmediateOperation extends ImmediateValueOperation, Operation {
    readonly type: OPERATION.CPI;
}

export interface IncrementRegisterOperation extends Operation, RegisterOperation {
    readonly type: OPERATION.INR;
}

export interface DecrementRegisterOperation extends Operation, RegisterOperation {
    readonly type: OPERATION.DCR;
}

export interface Decrement16BitRegisterOperation extends Operation, RegisterOperation {
    readonly type: OPERATION.DCX;
}

export interface Increment16BitRegisterOperation extends Operation, RegisterOperation {
    readonly type: OPERATION.INX;
}

export interface Add16BitOperation extends RegisterOperation, Operation {
    readonly type: OPERATION.DAD;
}

export interface RotateArithmeticRightOperation extends Operation {
    readonly type: OPERATION.RAR;
}

export interface RotateRightCarryOperation extends Operation {
    readonly type: OPERATION.RRC;
}

export interface RotateArithmeticLeftOperation extends Operation {
    readonly type: OPERATION.RAL;
}

export interface RotateLeftCarryOperation extends Operation {
    readonly type: OPERATION.RLC;
}

export interface SetCarryOperation extends Operation {
    readonly type: OPERATION.STC;
}

export interface ComplementCarryOperation extends Operation {
    readonly type: OPERATION.CMC;
}

export interface ComplementAccumulatorOperation extends Operation {
    readonly type: OPERATION.CMA;
}

export interface DecimalAdjustAccumulatorOperation extends Operation {
    readonly type: OPERATION.DAA;
}


export type MiscAluOperation =
    SetCarryOperation |
    ComplementCarryOperation |
    ComplementAccumulatorOperation |
    DecimalAdjustAccumulatorOperation

export type RotateOperation =
    RotateArithmeticRightOperation |
    RotateRightCarryOperation |
    RotateArithmeticLeftOperation |
    RotateLeftCarryOperation;

export type LogicOperation =
    AnaOperation |
    XraOperation |
    OraOperation |
    AnaImmediateOperation |
    XraImmediateOperation |
    OraImmediateOperation;

export type IncOrDecOperation =
    IncrementRegisterOperation |
    DecrementRegisterOperation;

export type ArithmeticOperation =
    AddOperation |
    AdcOperation |
    SubOperation |
    SbbOperation |
    CmpOperation |
    AddImmediateOperation |
    AdcImmediateOperation |
    SubImmediateOperation |
    SbbImmediateOperation |
    CmpImmediateOperation ;

export type ArithmeticLogicOperation =
    MiscAluOperation |
    RotateOperation |
    IncOrDecOperation |
    LogicOperation |
    ArithmeticOperation |
    Decrement16BitRegisterOperation |
    Increment16BitRegisterOperation |
    Add16BitOperation;


