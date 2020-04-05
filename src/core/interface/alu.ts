import {IFlags} from "./flags";
import {HighLow} from "./register";

export interface IAluResult {
    readonly result: number;
    readonly flags: IFlags;
}

export interface IXAluResult {
    readonly result: HighLow;
    readonly flags: IFlags;
}


export interface IAlu {

    add(a: number, b: number): IAluResult;

    adc(a: number, b: number, c: boolean): IAluResult;

    sub(a: number, b: number): IAluResult;

    sbb(a: number, b: number, c: boolean): IAluResult;

    and(a: number, b: number): IAluResult;

    or(a: number, b: number): IAluResult;

    xor(a: number, b: number): IAluResult;

    cmp(a: number, b: number): IAluResult;

    rotateLeftThroughCarry(a: number, carry: boolean): IAluResult;

    rotateRightThroughCarry(a: number, carry: boolean): IAluResult;

    rotateLeft(a: number): IAluResult;

    rotateRight(a: number): IAluResult;

    increment(a: number): IAluResult;

    decrement(a: number): IAluResult;

    decimalAdjustAccumulator(a: number, carry: boolean, aux: boolean): IAluResult;

    complement(a: number): IAluResult;


    xAdd(a: HighLow, b: HighLow): IXAluResult;

    xIncrement(a: HighLow): IXAluResult;

    xDecrement(a: HighLow): IXAluResult;
}
