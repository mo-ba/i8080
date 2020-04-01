import {HighLow} from "../interface";
import {IXAluResult} from "../interface";
import {WORD_MAX} from "./bits";
import {NO_FLAGS} from "../cpu";

import {HighLowFN} from "./high-low.function";

const toHighLow = HighLowFN.toHighLow;
const toNumber = HighLowFN.toNumber;

export function xAdd(a: HighLow, b: HighLow): HighLow {
    const temp = toNumber(a) + toNumber(b)
    return toHighLow(temp & WORD_MAX);

}

export function xAddWithFlags(a: HighLow, b: HighLow): IXAluResult {
    const temp = toNumber(a) + toNumber(b)
    const result = toHighLow(temp & WORD_MAX);
    const carry = temp > WORD_MAX;
    const flags = {...NO_FLAGS, carry};
    return {result, flags};
}

export function xIncrementWithFlags(a: HighLow): IXAluResult {
    return xAddWithFlags(a, toHighLow(1));
}

export function xIncrement(a: HighLow): HighLow {
    return xAdd(a, toHighLow(1));
}

export function xDecrementWithFlags(a: HighLow): IXAluResult {
    const temp = toNumber(a) - 1
    const result = toHighLow(temp & WORD_MAX);
    const carry = temp < 0;
    const flags = {...NO_FLAGS, carry};
    return {result, flags};
}

export function xDecrement(a: HighLow): HighLow {
    const temp = toNumber(a) - 1
    return toHighLow(temp & WORD_MAX);
}
