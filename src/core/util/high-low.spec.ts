import {toHighLow, toNumber, WORD_CARY_BIT} from "./index";


describe('highLow test', () => {
    it('should number to highLow to number', () => {

        for (let i = 0; i < WORD_CARY_BIT; i += Math.floor(Math.random() * 50)) {
            expect(toNumber(toHighLow(i))).toEqual(i)
        }


    })
});
