import {calcParity, calcSign, calcZero} from './index';

describe('flag test', () => {
    it('should calcParity', () => {
        expect(calcParity(0)).toEqual(false);
        expect(calcParity(1)).toEqual(true);
        expect(calcParity(2)).toEqual(true);
        expect(calcParity(3)).toEqual(false);
        expect(calcParity(4)).toEqual(true);
        expect(calcParity(243)).toEqual(false);
        expect(calcParity(244)).toEqual(true);
    });
    it('should calcZero', () => {
        expect(calcZero(0)).toEqual(true);
        expect(calcZero(1)).toEqual(false);
        expect(calcZero(2)).toEqual(false);
        expect(calcZero(3)).toEqual(false);
        expect(calcZero(4)).toEqual(false);
        expect(calcZero(243)).toEqual(false);
        expect(calcZero(244)).toEqual(false);
        expect(calcZero(255)).toEqual(false);
    });

    it('should calcSign', () => {
        expect(calcSign(0)).toEqual(false);
        expect(calcSign(1)).toEqual(false);
        expect(calcSign(2)).toEqual(false);
        expect(calcSign(3)).toEqual(false);
        expect(calcSign(4)).toEqual(false);
        expect(calcSign(127)).toEqual(false);
        expect(calcSign(128)).toEqual(true);
        expect(calcSign(243)).toEqual(true);
        expect(calcSign(244)).toEqual(true);
        expect(calcSign(255)).toEqual(true);
    });
});
