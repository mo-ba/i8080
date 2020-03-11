import 'mocha';
import {expect} from 'chai';
import {IRegister, REGISTER} from "../interface/register";
import * as reg from "./register";
import * as mem from "./memory";
import {highLow, toHighLow} from "../util/high-low.function";

describe('register test', () => {

    let register: IRegister;

    beforeEach(() => {
        register = reg.build(mem.build());
    });

    const expectFalse = (...flags: boolean[]): void => flags.forEach(f => expect(f).to.eq(false));

    it('should do carry operations', () => {
        expect(register.getCarry()).to.eq(false);
        expect(register.toggleCarry().getCarry()).to.eq(true);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setCarry(false).getCarry()).to.eq(false);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setCarry(true).getCarry()).to.eq(true);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());

        expect(register.loadX(REGISTER.PSW)).to.eql({high: 0, low: 1});

        expect(register.toggleCarry().getCarry()).to.eq(false);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.loadX(REGISTER.PSW)).to.eql({high: 0, low: 0})
    });
    it('should do zero operations', () => {
        expect(1).to.equal(1);
        expect(register.getZero()).to.eq(false);
        expectFalse(register.getCarry(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setZero(true).getZero()).to.eq(true);
        expectFalse(register.getCarry(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setZero(false).getZero()).to.eq(false);
        expectFalse(register.getCarry(), register.getSign(), register.getAuxiliary(), register.getParity())

    });
    it('should do sign operations', () => {
        expect(register.getSign()).to.eq(false);
        expect(register.setSign(true).getSign()).to.eq(true);
        expectFalse(register.getCarry(), register.getZero(), register.getAuxiliary(), register.getParity());
        expect(register.setSign(false).getSign()).to.eq(false);
        expectFalse(register.getCarry(), register.getZero(), register.getAuxiliary(), register.getParity())
    });
    it('should do auxilary operations', () => {
        expect(register.getAuxiliary()).to.eq(false);
        expect(register.setAuxiliary(true).getAuxiliary()).to.eq(true);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getParity());
        expect(register.setAuxiliary(false).getAuxiliary()).to.eq(false);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getParity())
    });
    it('should do parity operations', () => {
        expect(register.getParity()).to.eq(false);
        expect(register.setParity(true).getParity()).to.eq(true);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary());
        expect(register.setParity(false).getParity()).to.eq(false);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary())
    });
    it('should have correct number (ENUM REGISTER)', () => {
        expect(REGISTER.B).to.equal(0);
        expect(REGISTER.C).to.equal(1);
        expect(REGISTER.D).to.equal(2);
        expect(REGISTER.E).to.equal(3);
        expect(REGISTER.H).to.equal(4);
        expect(REGISTER.L).to.equal(5);
        expect(REGISTER.M).to.equal(6);
        expect(REGISTER.A).to.equal(7);
        expect(REGISTER.PSW).to.equal(6);

    });

    it('should load store A', () => {
        const r = REGISTER.A;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });
    it('should load store B', () => {
        const r = REGISTER.B;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });
    it('should load store C', () => {
        const r = REGISTER.C;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });
    it('should load store D', () => {
        const r = REGISTER.D;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });
    it('should load store E', () => {
        const r = REGISTER.E;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });
    it('should load store H', () => {
        const r = REGISTER.H;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });
    it('should load store L', () => {
        const r = REGISTER.L;
        expect(register.store(r, 42).load(r)).to.eq(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
        ]).to.eql([0, 0, 0, 0, 0, 0])
    });

    it('should loadX BC', () => {
        register.store(REGISTER.B, 42).store(REGISTER.C, 23);
        expect(register.loadX(REGISTER.B)).to.eql(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity())
    });


    it('should loadX DE', () => {
        register.store(REGISTER.D, 42).store(REGISTER.E, 23);
        expect(register.loadX(REGISTER.D)).to.eql(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity())
    });

    it('should loadX HL', () => {
        register.store(REGISTER.H, 42).store(REGISTER.L, 23);
        expect(register.loadX(REGISTER.H)).to.eql(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
        ]).to.eql([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity())
    });
    it('should loadX PSW', () => {
        register.store(REGISTER.A, 42);
        expect(register.loadX(REGISTER.PSW)).to.eql({high: 42, low: 0});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity())
    });
    it('should loadX PSW', () => {
        register
            .store(REGISTER.A, 42)
            .setZero(true)
            .setParity(true);

        expect(register.loadX(REGISTER.PSW)).to.eql({high: 42, low: 68});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0]);
        expect([register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity()])
            .to.eql([false, true, false, false, true])
    });

    it('should storeX loadX DE', () => {
        register.storeX(REGISTER.D, highLow(42, 23));
        expect(register.loadX(REGISTER.D)).to.eql(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity())
    });
    it('should storeX loadX HL', () => {
        register.storeX(REGISTER.H, highLow(42, 23));
        expect(register.loadX(REGISTER.H)).to.eql(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
        ]).to.eql([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity())
    });
    it('should storeX loadX PSW', () => {
        register.storeX(REGISTER.PSW, {high: 42, low: 1});
        expect(register.loadX(REGISTER.PSW)).to.eql({high: 42, low: 1});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0]);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.getCarry()).to.eq(true)

    });
    it('should storeX loadX PSW', () => {
        register
            .storeX(REGISTER.PSW, {high: 42, low: 68});

        expect(register.loadX(REGISTER.PSW)).to.eql({high: 42, low: 68});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).to.eql([0, 0, 0, 0, 0, 0]);
        expect([register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity()])
            .to.eql([false, true, false, false, true])
    });

    it('should store', () => {
        register.store(REGISTER.B, 128);
        expect(register.load(REGISTER.B)).to.eq(128);
    });
    it('should store into memory', () => {

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 1)
            .store(REGISTER.M, 42);

        expect(register.load(REGISTER.M)).to.eql(42);

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 2)
            .store(REGISTER.M, 23);
        expect(register.load(REGISTER.M)).to.eql(23);

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 1);
        expect(register.load(REGISTER.M)).to.eql(42);

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 2);
        expect(register.load(REGISTER.M)).to.eql(23)
    });
    it('should use stack', () => {
        register.push(toHighLow(11111));
        register.push(toHighLow(22222));
        register.push(toHighLow(33333));
        register.push(toHighLow(44444));
        register.push(toHighLow(55555));
        expect(register.pop()).to.eql(toHighLow(55555))
        expect(register.pop()).to.eql(toHighLow(44444))
        expect(register.pop()).to.eql(toHighLow(33333))
        expect(register.pop()).to.eql(toHighLow(22222))
        expect(register.pop()).to.eql(toHighLow(11111))


    })

});
