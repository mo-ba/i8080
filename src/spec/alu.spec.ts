import {IAlu, IFlags} from '../core/interface';
import {toHighLow, toNumber, WORD_MAX} from '../core/util';
import {Alu} from '../core/cpu';


const binary = (s: string) => parseInt(s, 2);

const carry = true;
const zero = true;
const sign = true;
const parity = true;
const aux = true;

const NO_FLAGS: IFlags = {
    carry: false,
    zero: false,
    sign: false,
    parity: false,
    aux: false,
};
describe('alu test', () => {

    let alu: IAlu;

    beforeEach(() => {
        alu = new Alu();
    });

    it('should add', () => {
        expect(alu.add(1, 1)).toEqual({result: 2, flags: {...NO_FLAGS, parity}});
        expect(alu.add(8, 8)).toEqual({result: 16, flags: {...NO_FLAGS, aux, parity}});
        expect(alu.add(34, 56)).toEqual({result: 34 + 56 & 255, flags: {...NO_FLAGS}});
        expect(alu.add(39, 57)).toEqual({result: 39 + 57 & 255, flags: {...NO_FLAGS, aux,}});
        expect(alu.add(255, 255)).toEqual({result: 255 + 255 & 255, flags: {...NO_FLAGS, carry, aux, sign, parity}});
    });

    it('should adc with carry', () => {
        const c = true;
        expect(alu.adc(1, 1, c)).toEqual({result: 2 + 1, flags: {...NO_FLAGS,}});
        expect(alu.adc(8, 8, c)).toEqual({result: 16 + 1, flags: {...NO_FLAGS, aux}});
        expect(alu.adc(34, 56, c)).toEqual({result: 34 + 56 + 1 & 255, flags: {...NO_FLAGS, parity}});
        expect(alu.adc(39, 56, c)).toEqual({result: 39 + 56 + 1 & 255, flags: {...NO_FLAGS, aux}});
        expect(alu.adc(39, 57, c)).toEqual({result: 39 + 57 + 1 & 255, flags: {...NO_FLAGS, aux, parity}});
        expect(alu.adc(255, 255, c)).toEqual({
            result: 255 + 255 + +c & 255,
            flags: {...NO_FLAGS, carry, aux, sign}
        });
        expect(alu.adc(255, 1, c)).toEqual({
            result: 255 + 1 + +c & 255,
            flags: {...NO_FLAGS, carry, aux, parity}
        });
        expect(alu.adc(255, 0, c)).toEqual({
            result: 255 + +c & 255,
            flags: {...NO_FLAGS, carry, aux, zero}
        });
    });

    it('should adc without carry', () => {
        const c = false;
        expect(alu.adc(1, 1, c)).toEqual({result: 2, flags: {...NO_FLAGS, parity}});
        expect(alu.adc(8, 8, c)).toEqual({result: 16, flags: {...NO_FLAGS, aux, parity}});
        expect(alu.adc(34, 56, c)).toEqual({result: 34 + 56 & 255, flags: {...NO_FLAGS}});
        expect(alu.adc(39, 56, c)).toEqual({result: 39 + 56 & 255, flags: {...NO_FLAGS}});
        expect(alu.adc(39, 57, c)).toEqual({result: 39 + 57 & 255, flags: {...NO_FLAGS, aux}});
        expect(alu.adc(255, 255, c)).toEqual({
            result: 255 + 255 & 255,
            flags: {...NO_FLAGS, carry, aux, parity, sign}
        });
        expect(alu.adc(255, 1, c)).toEqual({
            result: 255 + 1 & 255,
            flags: {...NO_FLAGS, carry, aux, zero}
        });
        expect(alu.adc(255, 0, c)).toEqual({
            result: 255 & 255,
            flags: {...NO_FLAGS, sign}
        });
    });


    it('should sub', () => {
        expect(alu.sub(1, 1)).toEqual({result: 0 & 255, flags: {...NO_FLAGS, zero}});
        expect(alu.sub(8, 8)).toEqual({result: 8 - 8 & 255, flags: {...NO_FLAGS, zero}});
        expect(alu.sub(34, 56)).toEqual({result: 34 - 56 & 255, flags: {...NO_FLAGS, sign, carry, parity}});
        expect(alu.sub(39, 57)).toEqual({result: 39 - 57 & 255, flags: {...NO_FLAGS, sign, carry}});
        expect(alu.sub(56, 34,)).toEqual({result: 56 - 34 & 255, flags: {...NO_FLAGS, parity}});
        expect(alu.sub(57, 39,)).toEqual({result: 57 - 39 & 255, flags: {...NO_FLAGS}});
        expect(alu.sub(255, 255)).toEqual({result: 255 - 255 & 255, flags: {...NO_FLAGS, zero}});
    });

    it('should sbb with carry', () => {
        const c = true;
        const b = 1;
        expect(alu.sbb(1, 1, c)).toEqual({result: 1 - 1 - b & 255, flags: {...NO_FLAGS, carry, sign}});
        expect(alu.sbb(8, 8, c)).toEqual({result: 8 - 8 - b & 255, flags: {...NO_FLAGS, carry, sign}});
        expect(alu.sbb(34, 56, c)).toEqual({result: 34 - 56 - b & 255, flags: {...NO_FLAGS, parity, carry, sign}});
        expect(alu.sbb(39, 57, c)).toEqual({result: 39 - 57 - b & 255, flags: {...NO_FLAGS, sign, carry}});
        expect(alu.sbb(39, 200, c)).toEqual({result: 39 - 200 - b & 255, flags: {...NO_FLAGS, carry, parity}});
        expect(alu.sbb(56, 33, c)).toEqual({result: 56 - 33 - b & 255, flags: {...NO_FLAGS, parity}});
        expect(alu.sbb(56, 38, c)).toEqual({result: 56 - 38 - b & 255, flags: {...NO_FLAGS}});
        expect(alu.sbb(255, 255, c)).toEqual({result: 255 - 255 - b & 255, flags: {...NO_FLAGS, carry, sign}});
    });

    it('should sbb without carry', () => {
        const c = false;
        const b = 0;
        expect(alu.sbb(1, 1, c)).toEqual({result: 1 - 1 + b & 255, flags: {...NO_FLAGS, zero}});
        expect(alu.sbb(8, 8, c)).toEqual({result: 8 - 8 + b & 255, flags: {...NO_FLAGS, zero}});
        expect(alu.sbb(34, 56, c)).toEqual({result: 34 - 56 + b & 255, flags: {...NO_FLAGS, carry, parity, sign}});
        expect(alu.sbb(39, 57, c)).toEqual({result: 39 - 57 + b & 255, flags: {...NO_FLAGS, sign, carry}});
        expect(alu.sbb(39, 200, c)).toEqual({result: 39 - 200 + b & 255, flags: {...NO_FLAGS, carry}});
        expect(alu.sbb(56, 33, c)).toEqual({result: 56 - 33 + b & 255, flags: {...NO_FLAGS}});
        expect(alu.sbb(56, 38, c)).toEqual({result: 56 - 38 + b & 255, flags: {...NO_FLAGS}});
        expect(alu.sbb(255, 255, c)).toEqual({result: 255 - 255 + b & 255, flags: {...NO_FLAGS, zero}});
    });

    it('should complement', () => {
        expect(alu.complement(0)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.complement(255)).toEqual({result: 0, flags: {...NO_FLAGS, zero}});
        expect(alu.complement(1)).toEqual({result: 254, flags: {...NO_FLAGS, parity, sign}});
        expect(alu.complement(16)).toEqual({result: 239, flags: {...NO_FLAGS, parity, sign}});
    });

    it('should xor', () => {
        expect(alu.xor(255, 255)).toEqual({result: 0, flags: {...NO_FLAGS, zero}});
        expect(alu.xor(255, 0)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.xor(255, 1)).toEqual({result: 254, flags: {...NO_FLAGS, sign, parity}});
        expect(alu.xor(255, 16)).toEqual({result: 239, flags: {...NO_FLAGS, sign, parity}});
    });
    it('should and', () => {
        expect(alu.and(255, 255)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.and(255, 0)).toEqual({result: 0, flags: {...NO_FLAGS, zero}});
        expect(alu.and(255, 1)).toEqual({result: 1, flags: {...NO_FLAGS, parity}});
        expect(alu.and(255, 16)).toEqual({result: 16, flags: {...NO_FLAGS, parity}});
        expect(alu.and(17, 16)).toEqual({result: 16, flags: {...NO_FLAGS, parity}});
    });
    it('should or', () => {
        expect(alu.or(255, 255)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.or(1, 254)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.or(255, 0)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.or(255, 1)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.or(255, 16)).toEqual({result: 255, flags: {...NO_FLAGS, sign}});
        expect(alu.or(17, 16)).toEqual({result: 17, flags: {...NO_FLAGS}});
        expect(alu.or(1, 2)).toEqual({result: 3, flags: {...NO_FLAGS}});
    });


    it('should decimalAdjustAccumulator', () => {
        expect(alu.decimalAdjustAccumulator(0x7 + 0x9, false, true)).toEqual({
            result: 0x16,
            flags: {...NO_FLAGS, parity}
        });
        expect(alu.decimalAdjustAccumulator(0x55 + 0x46, false, false)).toEqual({
            result: 0x01,
            flags: {...NO_FLAGS, parity, carry}
        });
    });
    it('should decimal add 7 + 9', () => {
        const r0 = alu.add(0x7, 0x9);
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).toEqual({
            result: 0x16,
            flags: {...NO_FLAGS, parity}
        });
    });
    it('should decimal add 34 + 56', () => {
        const r0 = alu.add(0x34, 0x56);
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).toEqual({
            result: 0x90,
            flags: {...NO_FLAGS, sign}
        });
    });
    it('should decimal add 77 + 99', () => {
        const r0 = alu.add(0x77, 0x99);
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).toEqual({
            result: 0x76,
            flags: {...NO_FLAGS, parity, carry}
        });
    });
    it('should decimal add 70 + 99', () => {
        const r0 = alu.add(0x70, 0x99);
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).toEqual({
            result: 0x69,
            flags: {...NO_FLAGS, carry}
        });
    });
    it('should decimal add 99 + 99', () => {
        const r0 = alu.add(0x99, 0x99);
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).toEqual({
            result: 0x98,
            flags: {...NO_FLAGS, sign, parity, carry}
        });
    });
    it('should decimal add 99 + 99 +1', () => {
        const r0 = alu.adc(0x99, 0x99, true);
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).toEqual({
            result: 0x99,
            flags: {...NO_FLAGS, sign, carry}
        });
    });
    it('should do sub with carry out (1)', () => {
        expect(alu.sub(42, 41)).toEqual({
            result: 1,
            flags: {...NO_FLAGS, parity}
        });
    });
    it('should do sub with carry out (2)', () => {
        expect(alu.sub(42, 43)).toEqual({
            result: 255,
            flags: {...NO_FLAGS, sign, carry}
        });
    });


    it('should xAddWithFlags', () => {
        for (let i = 0; i <= WORD_MAX; i += Math.floor(Math.random() * 5000)) {
            for (let j = 0; j <= WORD_MAX; j += Math.floor(Math.random() * 5000)) {
                const result = alu.xAdd(toHighLow(i), toHighLow(j));
                const expected = i + j;
                expect(toNumber(result.result)).toEqual(expected & WORD_MAX);
                expect(result.flags.carry).toEqual(expected > WORD_MAX);

            }
        }
    });

    it('should xIncrementWithFlags', () => {


        expect(toNumber(alu.xIncrement(toHighLow(WORD_MAX)).result)).toEqual(0);
        expect(alu.xIncrement(toHighLow(WORD_MAX)).flags.carry).toEqual(true);

        expect(toNumber(alu.xIncrement(toHighLow(WORD_MAX - 1)).result)).toEqual(WORD_MAX);
        expect(alu.xIncrement(toHighLow(WORD_MAX - 1)).flags.carry).toEqual(false);

        for (let i = 0; i < WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = alu.xIncrement(toHighLow(i));
            const expected = i + 1;
            expect(toNumber(result.result)).toEqual(expected & WORD_MAX);
            expect(result.flags.carry).toEqual(false);
        }
    });
    it('should xDecrementWithFlags', () => {

        expect(toNumber(alu.xDecrement(toHighLow(0)).result)).toEqual(WORD_MAX);
        expect(alu.xDecrement(toHighLow(0)).flags.carry).toEqual(true);

        expect(toNumber(alu.xDecrement(toHighLow(1)).result)).toEqual(0);
        expect(alu.xDecrement(toHighLow(1)).flags.carry).toEqual(false);

        for (let i = 1; i <= WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = alu.xDecrement(toHighLow(i));
            const expected = i - 1;
            expect(toNumber(result.result)).toEqual(expected & WORD_MAX);
            expect(result.flags.carry).toEqual(false);


        }
    });

    it('should rotate left 10001001', () => {
        const a = binary('10001001');
        const b = binary('00010011');
        const result = alu.rotateLeft(a);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(true);
    });

    it('should rotate left 00010011', () => {
        const a = binary('00010011');
        const b = binary('00100110');
        const result = alu.rotateLeft(a);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(false);
    });

    it('should rotate left through carry 10001001 0', () => {
        const a = binary('10001001');
        const b = binary('00010010');
        const result = alu.rotateLeftThroughCarry(a, false);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(true);
    });

    it('should rotate left through carry 10001001 1', () => {
        const a = binary('10001001');
        const b = binary('00010011');
        const result = alu.rotateLeftThroughCarry(a, true);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(true);
    });

    it('should rotate left through carry 00010011 0', () => {
        const a = binary('00010011');
        const b = binary('00100110');
        const result = alu.rotateLeftThroughCarry(a, false);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(false);
    });
    it('should rotate left through carry 00010011 1', () => {
        const a = binary('00010011');
        const b = binary('00100111');
        const result = alu.rotateLeftThroughCarry(a, true);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(false);
    });

    it('should rotate right 10001001', () => {
        const a = binary('10001001');
        const b = binary('11000100');
        const result = alu.rotateRight(a);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(true);
    });

    it('should rotate right 00010010', () => {
        const a = binary('00010010');
        const b = binary('00001001');
        const result = alu.rotateRight(a);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(false);
    });

    it('should rotate right through carry  10001001 0', () => {
        const a = binary('10001001');
        const b = binary('01000100');
        const result = alu.rotateRightThroughCarry(a, false);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(true);
    });

    it('should rotate right through carry  10001001 1', () => {
        const a = binary('10001001');
        const b = binary('11000100');
        const result = alu.rotateRightThroughCarry(a, true);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(true);
    });

    it('should rotate right through carry  00010010 0', () => {
        const a = binary('00010010');
        const b = binary('00001001');
        const result = alu.rotateRightThroughCarry(a, false);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(false);
    });

    it('should rotate right through carry  00010010 1', () => {
        const a = binary('00010010');
        const b = binary('10001001');
        const result = alu.rotateRightThroughCarry(a, true);

        expect(result.result).toEqual(b);
        expect(result.flags.carry).toEqual(false);
    });

});
