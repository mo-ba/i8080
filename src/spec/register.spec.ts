import {IRegister, REGISTER} from '../core/interface';
import {highLow, toHighLow} from '../core/util';
import {async, TestBed} from '@angular/core/testing';
import {TOKEN} from '../app/cpu/tokens';
import {CpuModule} from '../app/cpu/cpu.module';


describe('register test', () => {

    let register: IRegister;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CpuModule
            ],
        }).compileComponents();
    }));
    beforeEach(() => {
        register = TestBed.get(TOKEN.REGISTER);
    });

    const expectFalse = (...flags: boolean[]): void => flags.forEach(f => expect(f).toEqual(false));

    it('should do carry operations', () => {
        expect(register.getCarry()).toEqual(false);
        expect(register.toggleCarry().getCarry()).toEqual(true);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setCarry(false).getCarry()).toEqual(false);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setCarry(true).getCarry()).toEqual(true);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());

        expect(register.loadX(REGISTER.PSW)).toEqual({high: 0, low: 1});

        expect(register.toggleCarry().getCarry()).toEqual(false);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.loadX(REGISTER.PSW)).toEqual({high: 0, low: 0});
    });
    it('should do zero operations', () => {
        expect(1).toEqual(1);
        expect(register.getZero()).toEqual(false);
        expectFalse(register.getCarry(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setZero(true).getZero()).toEqual(true);
        expectFalse(register.getCarry(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.setZero(false).getZero()).toEqual(false);
        expectFalse(register.getCarry(), register.getSign(), register.getAuxiliary(), register.getParity());

    });
    it('should do sign operations', () => {
        expect(register.getSign()).toEqual(false);
        expect(register.setSign(true).getSign()).toEqual(true);
        expectFalse(register.getCarry(), register.getZero(), register.getAuxiliary(), register.getParity());
        expect(register.setSign(false).getSign()).toEqual(false);
        expectFalse(register.getCarry(), register.getZero(), register.getAuxiliary(), register.getParity());
    });
    it('should do auxilary operations', () => {
        expect(register.getAuxiliary()).toEqual(false);
        expect(register.setAuxiliary(true).getAuxiliary()).toEqual(true);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getParity());
        expect(register.setAuxiliary(false).getAuxiliary()).toEqual(false);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getParity());
    });
    it('should do parity operations', () => {
        expect(register.getParity()).toEqual(false);
        expect(register.setParity(true).getParity()).toEqual(true);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary());
        expect(register.setParity(false).getParity()).toEqual(false);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary());
    });
    it('should have correct number (ENUM REGISTER)', () => {
        expect(REGISTER.B).toEqual(0);
        expect(REGISTER.C).toEqual(1);
        expect(REGISTER.D).toEqual(2);
        expect(REGISTER.E).toEqual(3);
        expect(REGISTER.H).toEqual(4);
        expect(REGISTER.L).toEqual(5);
        expect(REGISTER.M).toEqual(6);
        expect(REGISTER.A).toEqual(7);
        expect(REGISTER.PSW).toEqual(6);

    });

    it('should load store A', () => {
        const r = REGISTER.A;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });
    it('should load store B', () => {
        const r = REGISTER.B;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });
    it('should load store C', () => {
        const r = REGISTER.C;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });
    it('should load store D', () => {
        const r = REGISTER.D;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });
    it('should load store E', () => {
        const r = REGISTER.E;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });
    it('should load store H', () => {
        const r = REGISTER.H;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });
    it('should load store L', () => {
        const r = REGISTER.L;
        expect(register.store(r, 42).load(r)).toEqual(42);
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
    });

    it('should loadX BC', () => {
        register.store(REGISTER.B, 42).store(REGISTER.C, 23);
        expect(register.loadX(REGISTER.B)).toEqual(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
    });


    it('should loadX DE', () => {
        register.store(REGISTER.D, 42).store(REGISTER.E, 23);
        expect(register.loadX(REGISTER.D)).toEqual(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
    });

    it('should loadX HL', () => {
        register.store(REGISTER.H, 42).store(REGISTER.L, 23);
        expect(register.loadX(REGISTER.H)).toEqual(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
        ]).toEqual([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
    });
    it('should loadX PSW', () => {
        register.store(REGISTER.A, 42);
        expect(register.loadX(REGISTER.PSW)).toEqual({high: 42, low: 0});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
    });
    it('should loadX PSW', () => {
        register
            .store(REGISTER.A, 42)
            .setZero(true)
            .setParity(true);

        expect(register.loadX(REGISTER.PSW)).toEqual({high: 42, low: 68});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
        expect([register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity()])
            .toEqual([false, true, false, false, true]);
    });

    it('should storeX loadX DE', () => {
        register.storeX(REGISTER.D, highLow(42, 23));
        expect(register.loadX(REGISTER.D)).toEqual(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
    });
    it('should storeX loadX HL', () => {
        register.storeX(REGISTER.H, highLow(42, 23));
        expect(register.loadX(REGISTER.H)).toEqual(highLow(42, 23));
        expect([
            register.load(REGISTER.A),
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
        ]).toEqual([0, 0, 0, 0, 0]);
        expectFalse(register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
    });
    it('should storeX loadX PSW', () => {
        register.storeX(REGISTER.PSW, {high: 42, low: 1});
        expect(register.loadX(REGISTER.PSW)).toEqual({high: 42, low: 1});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
        expectFalse(register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity());
        expect(register.getCarry()).toEqual(true);

    });
    it('should storeX loadX PSW', () => {
        register
            .storeX(REGISTER.PSW, {high: 42, low: 68});

        expect(register.loadX(REGISTER.PSW)).toEqual({high: 42, low: 68});
        expect([
            register.load(REGISTER.B),
            register.load(REGISTER.C),
            register.load(REGISTER.D),
            register.load(REGISTER.E),
            register.load(REGISTER.H),
            register.load(REGISTER.L),
        ]).toEqual([0, 0, 0, 0, 0, 0]);
        expect([register.getCarry(), register.getZero(), register.getSign(), register.getAuxiliary(), register.getParity()])
            .toEqual([false, true, false, false, true]);
    });

    it('should store', () => {
        register.store(REGISTER.B, 128);
        expect(register.load(REGISTER.B)).toEqual(128);
    });
    it('should store into memory', () => {

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 1)
            .store(REGISTER.M, 42);

        expect(register.load(REGISTER.M)).toEqual(42);

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 2)
            .store(REGISTER.M, 23);
        expect(register.load(REGISTER.M)).toEqual(23);

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 1);
        expect(register.load(REGISTER.M)).toEqual(42);

        register
            .store(REGISTER.H, 0)
            .store(REGISTER.L, 2);
        expect(register.load(REGISTER.M)).toEqual(23);
    });
    it('should use stack', () => {
        register.push(toHighLow(11111));
        register.push(toHighLow(22222));
        register.push(toHighLow(33333));
        register.push(toHighLow(44444));
        register.push(toHighLow(55555));
        expect(register.pop()).toEqual(toHighLow(55555));
        expect(register.pop()).toEqual(toHighLow(44444));
        expect(register.pop()).toEqual(toHighLow(33333));
        expect(register.pop()).toEqual(toHighLow(22222));
        expect(register.pop()).toEqual(toHighLow(11111));


    });

});
