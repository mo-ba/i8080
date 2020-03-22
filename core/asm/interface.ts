import {OPERATION} from "../interface/operation/operation.types";

export type AsmOperand = (string | number)
export type AsmOperands = AsmOperand[]

export interface AsmOperation {
    code: OPERATION;
    operands: AsmOperands | null;
}

export interface Line {
    label: string | null
    operation: AsmOperation
}

export type Lines = Line[]

export interface SymbolMap {[p: string]: number }
