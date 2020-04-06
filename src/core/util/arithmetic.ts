import {WORD_MAX} from "./bits";

import {toHighLow, toNumber} from "./high-low.function";
import {IWord, IXAluResult, NO_FLAGS} from "../interface";


export function xAdd(a: IWord, b: IWord): IWord {
    const temp = toNumber(a) + toNumber(b)
    return toHighLow(temp & WORD_MAX);

}

export function xAddWithFlags(a: IWord, b: IWord): IXAluResult {
    const temp = toNumber(a) + toNumber(b)
    const result = toHighLow(temp & WORD_MAX);
    const carry = temp > WORD_MAX;
    const flags = {...NO_FLAGS, carry};
    return {result, flags};
}

export function xIncrementWithFlags(a: IWord): IXAluResult {
    return xAddWithFlags(a, toHighLow(1));
}

export function xIncrement(a: IWord): IWord {
    return xAdd(a, toHighLow(1));
}

export function xDecrementWithFlags(a: IWord): IXAluResult {
    const temp = toNumber(a) - 1
    const result = toHighLow(temp & WORD_MAX);
    const carry = temp < 0;
    const flags = {...NO_FLAGS, carry};
    return {result, flags};
}

export function xDecrement(a: IWord): IWord {
    const temp = toNumber(a) - 1
    return toHighLow(temp & WORD_MAX);
}
