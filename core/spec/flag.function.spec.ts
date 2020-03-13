import {expect} from "chai";
import {calcParity, calcSign, calcZero} from "../util/flag.function";

describe('flag test', () => {
    it('should calcParity', () => {
        expect(calcParity(0)).to.eql(false)
        expect(calcParity(1)).to.eql(true)
        expect(calcParity(2)).to.eql(true)
        expect(calcParity(3)).to.eql(false)
        expect(calcParity(4)).to.eql(true)
        expect(calcParity(243)).to.eql(false)
        expect(calcParity(244)).to.eql(true)
    })
    it('should calcZero', () => {
        expect(calcZero(0)).to.eql(true)
        expect(calcZero(1)).to.eql(false)
        expect(calcZero(2)).to.eql(false)
        expect(calcZero(3)).to.eql(false)
        expect(calcZero(4)).to.eql(false)
        expect(calcZero(243)).to.eql(false)
        expect(calcZero(244)).to.eql(false)
        expect(calcZero(255)).to.eql(false)
    })

    it('should calcSign', () => {
        expect(calcSign(0)).to.eql(false)
        expect(calcSign(1)).to.eql(false)
        expect(calcSign(2)).to.eql(false)
        expect(calcSign(3)).to.eql(false)
        expect(calcSign(4)).to.eql(false)
        expect(calcSign(127)).to.eql(false)
        expect(calcSign(128)).to.eql(true)
        expect(calcSign(243)).to.eql(true)
        expect(calcSign(244)).to.eql(true)
        expect(calcSign(255)).to.eql(true)
    })
})
