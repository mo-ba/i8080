import {HighLow} from "../interface/register";
import {BYTE_MAX, BYTE_LENGTH} from "./bits";

export function highLow(high: number, low: number): HighLow {
    return {high, low}
}

export function toHighLow(int16: number): HighLow {
    return highLow(int16 >> BYTE_LENGTH & BYTE_MAX, int16 & BYTE_MAX,)
}

export function toNumber(highLow: HighLow): number {
    return highLow.high << BYTE_LENGTH | highLow.low
}
