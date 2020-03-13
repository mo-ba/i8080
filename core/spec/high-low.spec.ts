import {expect} from "chai";
import {WORD_CARY_BIT} from "../util/bits";
import {HighLowFN} from "../util/high-low.function";

const toHighLow = HighLowFN.toHighLow;
const toNumber = HighLowFN.toNumber;

describe('highLow test', () => {
    it('should number to highLow to number', () => {

        for (let i = 0; i < WORD_CARY_BIT; i += Math.floor(Math.random() * 50)) {
            expect(toNumber(toHighLow(i))).to.eql(i)
        }


    })
})
