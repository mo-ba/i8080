import {HighLow} from "../interface/register";
import {IAluResult, IXAluResult} from "../interface/alu";
import {toHighLow, toNumber} from "./high-low.function";
import {WORD_CARY_BIT, WORD_MAX} from "./bits";
import {NO_FLAGS} from "../impl/flags";


export function xAdd(a: HighLow, b: HighLow): IXAluResult {
    const temp = toNumber(a) + toNumber(b)
    const carry = temp > WORD_MAX;
    const result = toHighLow(temp & WORD_MAX);
    const flags = {...NO_FLAGS, carry};
    return {result, flags};
}

export function xInc(a: HighLow): IXAluResult {
    return xAdd(a, toHighLow(1));
}

export function xDec(a: HighLow): IXAluResult {
    const temp = toNumber(a) - 1
    const carry = temp < 0;
    const result = toHighLow(temp & WORD_MAX);
    const flags = {...NO_FLAGS, carry};
    return {result, flags};
}
