import {WORD_MAX} from "./bits";
import {xAddWithFlags, xDecrementWithFlags, xIncrementWithFlags} from "./arithmetic";
import {toHighLow, toNumber} from "./high-low.function";
import {expect} from "chai";

describe('flag test', () => {
    it('should xAddWithFlags', () => {
        for (let i = 0; i <= WORD_MAX; i += Math.floor(Math.random() * 5000)) {
            for (let j = 0; j <= WORD_MAX; j += Math.floor(Math.random() * 5000)) {
                const result = xAddWithFlags(toHighLow(i), toHighLow(j))
                const expected = i + j
                expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
                expect(result.flags.carry).to.eql(expected > WORD_MAX)

            }
        }
    })
    it('should xIncrementWithFlags', () => {


        expect(toNumber(xIncrementWithFlags(toHighLow(WORD_MAX)).result)).to.eql(0)
        expect(xIncrementWithFlags(toHighLow(WORD_MAX)).flags.carry).to.eql(true)

        expect(toNumber(xIncrementWithFlags(toHighLow(WORD_MAX - 1)).result)).to.eql(WORD_MAX)
        expect(xIncrementWithFlags(toHighLow(WORD_MAX - 1)).flags.carry).to.eql(false)

        for (let i = 0; i < WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xIncrementWithFlags(toHighLow(i))
            const expected = i + 1
            expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
            expect(result.flags.carry).to.eql(false)
        }
    })
    it('should xDecrementWithFlags', () => {

        expect(toNumber(xDecrementWithFlags(toHighLow(0)).result)).to.eql(WORD_MAX)
        expect(xDecrementWithFlags(toHighLow(0)).flags.carry).to.eql(true)

        expect(toNumber(xDecrementWithFlags(toHighLow(1)).result)).to.eql(0)
        expect(xDecrementWithFlags(toHighLow(1)).flags.carry).to.eql(false)

        for (let i = 1; i <= WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xDecrementWithFlags(toHighLow(i))
            const expected = i - 1
            expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
            expect(result.flags.carry).to.eql(false)


        }
    })
})
