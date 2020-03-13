import {HighLow} from "../interface/register";
import {BYTE_LENGTH, BYTE_MAX} from "./bits";

export abstract class HighLowFN {

    public static highLow(high: number, low: number): HighLow {
        return {high, low};
    }

    public static toHighLow(int16: number): HighLow {
        return HighLowFN.highLow(int16 >> BYTE_LENGTH & BYTE_MAX, int16 & BYTE_MAX);
    }

    public static toNumber(highLow: HighLow): number {
        return highLow.high << BYTE_LENGTH | highLow.low;
    }

}
