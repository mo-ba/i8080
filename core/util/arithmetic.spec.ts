import {WORD_MAX} from "./bits";
import {xAdd, xDec, xInc} from "./arithmetic";
import {toHighLow, toNumber} from "./high-low.function";
import {expect} from "chai";

describe('flag test', () => {
    it('should xAdd', () => {
        for (let i = 0; i <= WORD_MAX; i += Math.floor(Math.random() * 5000)) {
            for (let j = 0; j <= WORD_MAX; j += Math.floor(Math.random() * 5000)) {
                const result = xAdd(toHighLow(i), toHighLow(j))
                const expected = i + j
                expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
                expect(result.flags.carry).to.eql(expected > WORD_MAX)

            }
        }
    })
    it('should xInc', () => {


        expect(toNumber(xInc(toHighLow(WORD_MAX)).result)).to.eql(0)
        expect(xInc(toHighLow(WORD_MAX)).flags.carry).to.eql(true)

        expect(toNumber(xInc(toHighLow(WORD_MAX - 1)).result)).to.eql(WORD_MAX)
        expect(xInc(toHighLow(WORD_MAX - 1)).flags.carry).to.eql(false)

        for (let i = 0; i < WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xInc(toHighLow(i))
            const expected = i + 1
            expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
            expect(result.flags.carry).to.eql(false)
        }
    })
    it('should xDec', () => {

        expect(toNumber(xDec(toHighLow(0)).result)).to.eql(WORD_MAX)
        expect(xDec(toHighLow(0)).flags.carry).to.eql(true)

        expect(toNumber(xDec(toHighLow(1)).result)).to.eql(0)
        expect(xDec(toHighLow(1)).flags.carry).to.eql(false)

        for (let i = 1; i <= WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xDec(toHighLow(i))
            const expected = i - 1
            expect(toNumber(result.result)).to.eql(expected & WORD_MAX)
            expect(result.flags.carry).to.eql(false)


        }
    })
})
