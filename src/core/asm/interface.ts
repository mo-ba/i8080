import {OPERATION} from '../interface/operation/operation.types';

export type AsmOperand = (string | number)
export type AsmOperands = any[]

export interface AsmOperation {
    code?: OPERATION;
    operands?: AsmOperands | null;
}

export interface Location {
    offset: number
    line: number
    column: number
}

export interface Line {
    label?: string | null
    operation?: AsmOperation | null
    comment?: string | null
    location?: {
        start?: Location
        end?: Location
    }
}

export type Lines = Line[]

export interface SymbolMap {
    [p: string]: number
}
