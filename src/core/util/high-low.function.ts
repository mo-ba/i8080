import {IWord} from '../interface';
import {BYTE_LENGTH, BYTE_MAX} from './bits';

export function highLow(high: number, low: number): IWord {
    return {high, low};
}

export function toHighLow(int16: number): IWord {
    return highLow(int16 >> BYTE_LENGTH & BYTE_MAX, int16 & BYTE_MAX);
}

export function toNumber(highLow: IWord): number {
    return highLow.high << BYTE_LENGTH | highLow.low;
}
