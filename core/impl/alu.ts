import {IAlu, IAluResult, IXAluResult} from "../interface/alu";
import {calcParity, calcSign, calcZero} from "../util/flag.function";
import {NO_FLAGS} from "./flags";
import {
    AUX_BIT,
    BYTE_CARRY_BIT,
    BYTE_HIGH_BITS,
    BYTE_MAX,
    DECIMAL_ADJUST,
    DECIMAL_MAX_DIGIT,
    NIBBLE_LENGTH, NIBBLE_MAX
} from "../util/bits";
import {xAdd, xDec, xInc} from "../util/arithmetic";
import {HighLow} from "../interface/register";

function calcFlags(a: number): {
    zero: boolean;
    sign: boolean;
    parity: boolean;
} {
    return {
        zero: calcZero(a),
        sign: calcSign(a),
        parity: calcParity(a),
    };
}


class Alu implements IAlu {


    adc(a: number, b: number, c: boolean): IAluResult {
        const carryIn = +c;

        const al = a & NIBBLE_MAX;
        const bl = (b & NIBBLE_MAX) + carryIn;
        const resultLow = al + bl;
        const aux: boolean = 0 !== (resultLow & AUX_BIT);

        const resultTotal = a + b + +carryIn;
        const carry: boolean = 0 != (resultTotal & BYTE_CARRY_BIT);
        const result = resultTotal & BYTE_MAX;
        const flags = {...calcFlags(result), carry, aux};

        return {result, flags};

    }


    sbb(a: number, b: number, c: boolean): IAluResult {
        const r = a - b + -c;
        const carry = r < 0;
        const result = r & BYTE_MAX;
        const flags = {...calcFlags(result), carry, aux: false};

        return {result, flags};
    }


    add(a: number, b: number): IAluResult {
        return this.adc(a, b, false);
    }


    cmp(a: number, b: number): IAluResult {
        return this.sub(a, b);
    }

    decimalAdjustAccumulator(num: number, carryIn: boolean, aux: boolean): IAluResult {

        const r0 = num + ((num & NIBBLE_MAX) > DECIMAL_MAX_DIGIT || aux ? DECIMAL_ADJUST : 0);
        const r1 = r0 + (
            (r0 & BYTE_HIGH_BITS) > DECIMAL_MAX_DIGIT << NIBBLE_LENGTH ||
            carryIn ? DECIMAL_ADJUST << NIBBLE_LENGTH : 0
        );
        const carry = 0 != (r1 & BYTE_CARRY_BIT) || carryIn;
        const result = r1 & BYTE_MAX;

        return {result, flags: {...NO_FLAGS, carry, ...calcFlags(result)}};
    }

    decrement(a: number): IAluResult {
        return this.sub(a, 1);
    }

    increment(a: number): IAluResult {
        const result = this.add(a, 1)
        return result;
    }


    sub(a: number, b: number): IAluResult {
        return this.sbb(a, b, false);
    }

    and(a: number, b: number): IAluResult {
        const result = (a & b) & BYTE_MAX
        return {result, flags: {...NO_FLAGS, ...calcFlags(result)}};
    }

    or(a: number, b: number): IAluResult {
        const result = (a | b) & BYTE_MAX
        return {result, flags: {...NO_FLAGS, ...calcFlags(result)}};
    }

    xor(a: number, b: number): IAluResult {
        const result = (a ^ b) & BYTE_MAX
        return {result, flags: {...NO_FLAGS, ...calcFlags(result)}};
    }

    complement(a: number): IAluResult {
        const result = (a ^ BYTE_MAX) & BYTE_MAX
        return {result, flags: {...NO_FLAGS, ...calcFlags(result)}};
    }


    xAdd(a: HighLow, b: HighLow): IXAluResult {
        return xAdd(a, b);
    }

    xIncrement(a: HighLow): IXAluResult {
        return xInc(a);
    }

    xDecrement(a: HighLow): IXAluResult {
        return xDec(a);
    }


}

export function build(): IAlu {
    return new Alu()
}
