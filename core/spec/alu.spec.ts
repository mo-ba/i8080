import 'mocha';
import {expect} from 'chai';
import {build} from "../impl/alu";
import {IAlu} from "../interface/alu";
import {IFlags} from "../interface/flags";
import {WORD_MAX} from "../util/bits";
import {toHighLow, toNumber} from "../util/high-low.function";


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
        alu = build();
    });

    it('should add', () => {
        expect(alu.add(1, 1)).to.eql({result: 2, flags: {...NO_FLAGS, parity}})
        expect(alu.add(8, 8)).to.eql({result: 16, flags: {...NO_FLAGS, aux, parity}})
        expect(alu.add(34, 56)).to.eql({result: 34 + 56 & 255, flags: {...NO_FLAGS}})
        expect(alu.add(39, 57)).to.eql({result: 39 + 57 & 255, flags: {...NO_FLAGS, aux,}})
        expect(alu.add(255, 255)).to.eql({result: 255 + 255 & 255, flags: {...NO_FLAGS, carry, aux, sign, parity}})
    });

    it('should adc with carry', () => {
        const c = true
        expect(alu.adc(1, 1, c)).to.eql({result: 2 + 1, flags: {...NO_FLAGS,}})
        expect(alu.adc(8, 8, c)).to.eql({result: 16 + 1, flags: {...NO_FLAGS, aux}})
        expect(alu.adc(34, 56, c)).to.eql({result: 34 + 56 + 1 & 255, flags: {...NO_FLAGS, parity}})
        expect(alu.adc(39, 56, c)).to.eql({result: 39 + 56 + 1 & 255, flags: {...NO_FLAGS, aux}})
        expect(alu.adc(39, 57, c)).to.eql({result: 39 + 57 + 1 & 255, flags: {...NO_FLAGS, aux, parity}})
        expect(alu.adc(255, 255, c)).to.eql({
            result: 255 + 255 + +c & 255,
            flags: {...NO_FLAGS, carry, aux, sign}
        })
        expect(alu.adc(255, 1, c)).to.eql({
            result: 255 + 1 + +c & 255,
            flags: {...NO_FLAGS, carry, aux, parity}
        })
        expect(alu.adc(255, 0, c)).to.eql({
            result: 255 + +c & 255,
            flags: {...NO_FLAGS, carry, aux, zero}
        })
    });

    it('should adc without carry', () => {
        const c = false
        expect(alu.adc(1, 1, c)).to.eql({result: 2, flags: {...NO_FLAGS, parity}})
        expect(alu.adc(8, 8, c)).to.eql({result: 16, flags: {...NO_FLAGS, aux, parity}})
        expect(alu.adc(34, 56, c)).to.eql({result: 34 + 56 & 255, flags: {...NO_FLAGS}})
        expect(alu.adc(39, 56, c)).to.eql({result: 39 + 56 & 255, flags: {...NO_FLAGS}})
        expect(alu.adc(39, 57, c)).to.eql({result: 39 + 57 & 255, flags: {...NO_FLAGS, aux}})
        expect(alu.adc(255, 255, c)).to.eql({
            result: 255 + 255 & 255,
            flags: {...NO_FLAGS, carry, aux, parity, sign}
        })
        expect(alu.adc(255, 1, c)).to.eql({
            result: 255 + 1 & 255,
            flags: {...NO_FLAGS, carry, aux, zero}
        })
        expect(alu.adc(255, 0, c)).to.eql({
            result: 255 & 255,
            flags: {...NO_FLAGS, sign}
        })
    });


    it('should sub', () => {
        expect(alu.sub(1, 1)).to.eql({result: 0 & 255, flags: {...NO_FLAGS, zero}})
        expect(alu.sub(8, 8)).to.eql({result: 8 - 8 & 255, flags: {...NO_FLAGS, zero}})
        expect(alu.sub(34, 56)).to.eql({result: 34 - 56 & 255, flags: {...NO_FLAGS, sign, carry, parity}})
        expect(alu.sub(39, 57)).to.eql({result: 39 - 57 & 255, flags: {...NO_FLAGS, sign, carry}})
        expect(alu.sub(56, 34,)).to.eql({result: 56 - 34 & 255, flags: {...NO_FLAGS, parity}})
        expect(alu.sub(57, 39,)).to.eql({result: 57 - 39 & 255, flags: {...NO_FLAGS}})
        expect(alu.sub(255, 255)).to.eql({result: 255 - 255 & 255, flags: {...NO_FLAGS, zero}})
    });

    it('should sbb with carry', () => {
        const c = true
        const b = 1
        expect(alu.sbb(1, 1, c)).to.eql({result: 1 - 1 - b & 255, flags: {...NO_FLAGS, carry, sign}})
        expect(alu.sbb(8, 8, c)).to.eql({result: 8 - 8 - b & 255, flags: {...NO_FLAGS, carry, sign}})
        expect(alu.sbb(34, 56, c)).to.eql({result: 34 - 56 - b & 255, flags: {...NO_FLAGS, parity, carry, sign}})
        expect(alu.sbb(39, 57, c)).to.eql({result: 39 - 57 - b & 255, flags: {...NO_FLAGS, sign, carry}})
        expect(alu.sbb(39, 200, c)).to.eql({result: 39 - 200 - b & 255, flags: {...NO_FLAGS, carry, parity}})
        expect(alu.sbb(56, 33, c)).to.eql({result: 56 - 33 - b & 255, flags: {...NO_FLAGS, parity}})
        expect(alu.sbb(56, 38, c)).to.eql({result: 56 - 38 - b & 255, flags: {...NO_FLAGS}})
        expect(alu.sbb(255, 255, c)).to.eql({result: 255 - 255 - b & 255, flags: {...NO_FLAGS, carry, sign}})
    });

    it('should sbb without carry', () => {
        const c = false
        const b = 0
        expect(alu.sbb(1, 1, c)).to.eql({result: 1 - 1 + b & 255, flags: {...NO_FLAGS, zero}})
        expect(alu.sbb(8, 8, c)).to.eql({result: 8 - 8 + b & 255, flags: {...NO_FLAGS, zero}})
        expect(alu.sbb(34, 56, c)).to.eql({result: 34 - 56 + b & 255, flags: {...NO_FLAGS, carry, parity, sign}})
        expect(alu.sbb(39, 57, c)).to.eql({result: 39 - 57 + b & 255, flags: {...NO_FLAGS, sign, carry}})
        expect(alu.sbb(39, 200, c)).to.eql({result: 39 - 200 + b & 255, flags: {...NO_FLAGS, carry}})
        expect(alu.sbb(56, 33, c)).to.eql({result: 56 - 33 + b & 255, flags: {...NO_FLAGS}})
        expect(alu.sbb(56, 38, c)).to.eql({result: 56 - 38 + b & 255, flags: {...NO_FLAGS}})
        expect(alu.sbb(255, 255, c)).to.eql({result: 255 - 255 + b & 255, flags: {...NO_FLAGS, zero}})
    });

    it('should complement', () => {
        expect(alu.complement(0)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.complement(255)).to.eql({result: 0, flags: {...NO_FLAGS, zero}})
        expect(alu.complement(1)).to.eql({result: 254, flags: {...NO_FLAGS, parity, sign}})
        expect(alu.complement(16)).to.eql({result: 239, flags: {...NO_FLAGS, parity, sign}})
    })

    it('should xor', () => {
        expect(alu.xor(255, 255)).to.eql({result: 0, flags: {...NO_FLAGS, zero}})
        expect(alu.xor(255, 0)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.xor(255, 1)).to.eql({result: 254, flags: {...NO_FLAGS, sign, parity}})
        expect(alu.xor(255, 16)).to.eql({result: 239, flags: {...NO_FLAGS, sign, parity}})
    })
    it('should and', () => {
        expect(alu.and(255, 255)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.and(255, 0)).to.eql({result: 0, flags: {...NO_FLAGS, zero}})
        expect(alu.and(255, 1)).to.eql({result: 1, flags: {...NO_FLAGS, parity}})
        expect(alu.and(255, 16)).to.eql({result: 16, flags: {...NO_FLAGS, parity}})
        expect(alu.and(17, 16)).to.eql({result: 16, flags: {...NO_FLAGS, parity}})
    })
    it('should or', () => {
        expect(alu.or(255, 255)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.or(1, 254)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.or(255, 0)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.or(255, 1)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.or(255, 16)).to.eql({result: 255, flags: {...NO_FLAGS, sign}})
        expect(alu.or(17, 16)).to.eql({result: 17, flags: {...NO_FLAGS}})
        expect(alu.or(1, 2)).to.eql({result: 3, flags: {...NO_FLAGS}})
    })


    it('should decimalAdjustAccumulator', () => {
        expect(alu.decimalAdjustAccumulator(0x7 + 0x9, false, true)).to.eql({
            result: 0x16,
            flags: {...NO_FLAGS, parity}
        })
        expect(alu.decimalAdjustAccumulator(0x55 + 0x46, false, false)).to.eql({
            result: 0x01,
            flags: {...NO_FLAGS, parity, carry}
        })
    });
    it('should decimal add 7 + 9', () => {
        const r0 = alu.add(0x7, 0x9)
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).to.eql({
            result: 0x16,
            flags: {...NO_FLAGS, parity}
        })
    });
    it('should decimal add 34 + 56', () => {
        const r0 = alu.add(0x34, 0x56)
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).to.eql({
            result: 0x90,
            flags: {...NO_FLAGS, sign}
        })
    });
    it('should decimal add 77 + 99', () => {
        const r0 = alu.add(0x77, 0x99)
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).to.eql({
            result: 0x76,
            flags: {...NO_FLAGS, parity, carry}
        })
    });
    it('should decimal add 70 + 99', () => {
        const r0 = alu.add(0x70, 0x99)
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).to.eql({
            result: 0x69,
            flags: {...NO_FLAGS, carry}
        })
    });
    it('should decimal add 99 + 99', () => {
        const r0 = alu.add(0x99, 0x99)
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).to.eql({
            result: 0x98,
            flags: {...NO_FLAGS, sign, parity, carry}
        })
    });
    it('should decimal add 99 + 99 +1', () => {
        const r0 = alu.adc(0x99, 0x99, true)
        expect(alu.decimalAdjustAccumulator(r0.result, r0.flags.carry, r0.flags.aux)).to.eql({
            result: 0x99,
            flags: {...NO_FLAGS, sign, carry}
        })
    });
    it('should do sub with carry out (1)', () => {
        expect(alu.sub(42, 41)).to.eql({
            result: 1,
            flags: {...NO_FLAGS, parity}
        })
    });
    it('should do sub with carry out (2)', () => {
        expect(alu.sub(42, 43)).to.eql({
            result: 255,
            flags: {...NO_FLAGS, sign, carry}
        })
    });


    it('should xAddWithFlags', () => {
        for (let i = 0; i <= WORD_MAX; i += Math.floor(Math.random() * 5000)) {
            for (let j = 0; j <= WORD_MAX; j += Math.floor(Math.random() * 5000)) {
                const result = alu.xAdd(toHighLow(i), toHighLow(j))
                const expected = i + j
                expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
                expect(result.flags.carry).to.eql(expected > WORD_MAX)

            }
        }
    })
    it('should xIncrementWithFlags', () => {


        expect(toNumber(alu.xIncrement(toHighLow(WORD_MAX)).result)).to.eql(0)
        expect(alu.xIncrement(toHighLow(WORD_MAX)).flags.carry).to.eql(true)

        expect(toNumber(alu.xIncrement(toHighLow(WORD_MAX - 1)).result)).to.eql(WORD_MAX)
        expect(alu.xIncrement(toHighLow(WORD_MAX - 1)).flags.carry).to.eql(false)

        for (let i = 0; i < WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = alu.xIncrement(toHighLow(i))
            const expected = i + 1
            expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
            expect(result.flags.carry).to.eql(false)
        }
    })
    it('should xDecrementWithFlags', () => {

        expect(toNumber(alu.xDecrement(toHighLow(0)).result)).to.eql(WORD_MAX)
        expect(alu.xDecrement(toHighLow(0)).flags.carry).to.eql(true)

        expect(toNumber(alu.xDecrement(toHighLow(1)).result)).to.eql(0)
        expect(alu.xDecrement(toHighLow(1)).flags.carry).to.eql(false)

        for (let i = 1; i <= WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = alu.xDecrement(toHighLow(i))
            const expected = i - 1
            expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
            expect(result.flags.carry).to.be.eql(false)


        }
    })

});
