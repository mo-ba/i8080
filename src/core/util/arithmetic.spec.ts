import {
    toHighLow,
    toNumber,
    WORD_MAX,
    xAddWithFlags,
    xDecrement,
    xDecrementWithFlags,
    xIncrement,
    xIncrementWithFlags
} from "./index";


describe('flag test', () => {
    it('should xAddWithFlags', () => {
        for (let i = 0; i <= WORD_MAX; i += Math.floor(Math.random() * 5000)) {
            for (let j = 0; j <= WORD_MAX; j += Math.floor(Math.random() * 5000)) {
                const result = xAddWithFlags(toHighLow(i), toHighLow(j));
                const expected = i + j;
                expect(toNumber(result.result)).toEqual(expected & WORD_MAX)
                expect(result.flags.carry).toEqual(expected > WORD_MAX)
            }
        }
    })
    it('should xIncrementWithFlags', () => {


        expect(toNumber(xIncrementWithFlags(toHighLow(WORD_MAX)).result)).toEqual(0)
        expect(xIncrementWithFlags(toHighLow(WORD_MAX)).flags.carry).toEqual(true)

        expect(toNumber(xIncrementWithFlags(toHighLow(WORD_MAX - 1)).result)).toEqual(WORD_MAX)
        expect(xIncrementWithFlags(toHighLow(WORD_MAX - 1)).flags.carry).toEqual(false)

        for (let i = 0; i < WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xIncrementWithFlags(toHighLow(i))
            const expected = i + 1
            expect(toNumber(result.result)).toEqual(expected & WORD_MAX)
            expect(result.flags.carry).toEqual(false)
        }
    })
    it('should xIncrementWithFlags', () => {
        expect(toNumber(xIncrement(toHighLow(WORD_MAX)))).toEqual(0)

        expect(toNumber(xIncrement(toHighLow(WORD_MAX - 1)))).toEqual(WORD_MAX)

        for (let i = 0; i < WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xIncrement(toHighLow(i))
            const expected = i + 1
            expect(toNumber(result)).toEqual(expected & WORD_MAX)
        }
    })
    it('should xDecrementWithFlags', () => {

        expect(toNumber(xDecrementWithFlags(toHighLow(0)).result)).toEqual(WORD_MAX)
        expect(xDecrementWithFlags(toHighLow(0)).flags.carry).toEqual(true)

        expect(toNumber(xDecrementWithFlags(toHighLow(1)).result)).toEqual(0)
        expect(xDecrementWithFlags(toHighLow(1)).flags.carry).toEqual(false)

        for (let i = 1; i <= WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xDecrementWithFlags(toHighLow(i))
            const expected = i - 1
            expect(toNumber(result.result)).toEqual(expected & WORD_MAX)
            expect(result.flags.carry).toEqual(false)


        }
    })
    it('should xDecrement', () => {

        expect(toNumber(xDecrement(toHighLow(0)))).toEqual(WORD_MAX)

        expect(toNumber(xDecrement(toHighLow(1)))).toEqual(0)

        for (let i = 1; i <= WORD_MAX; i += Math.floor(Math.random() * 1000)) {

            const result = xDecrement(toHighLow(i))
            const expected = i - 1
            expect(toNumber(result)).toEqual(expected & WORD_MAX)


        }
    })
})
