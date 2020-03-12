import * as reg from "../impl/register";
import * as mem from "../impl/memory";
import * as alu from "../impl/alu";
import * as exec from "../impl/executor";
import {IExecutor} from "../interface/executor";
import {IRegister, REGISTER, registerList} from "../interface/register";
import {OPERATION} from "../interface/operation/operation.types";
import {expect} from "chai";
import {BYTE_MAX} from "../util/bits";
import {calcParity, calcSign, calcZero} from "../util/flag.function";

let executor: IExecutor;
let register: IRegister;

function rebuild() {
    register = reg.build(mem.build())
    executor = exec.build(register, alu.build());
}

describe('exec', () => {
    describe('exec test move', () => {

        beforeEach(() => {
            rebuild()
        });

        it('should move immediate', () => {
            executor.execute({type: OPERATION.MVI, to: REGISTER.A, value: 42});
            expect(register.load(REGISTER.A)).to.eq(42);

        });
        it('should move ', () => {
            register.store(REGISTER.A, 42);
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(42);
            expect(register.load(REGISTER.B)).to.eq(42);

        });
        it('should move ', () => {
            register.store(REGISTER.A, 42);
            register.store(REGISTER.B, 21);
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.M,});
            expect(register.load(REGISTER.A)).to.eq(42);
            expect(register.load(REGISTER.B)).to.eq(21);
            expect(register.load(REGISTER.M)).to.eq(42);
            executor.execute({type: OPERATION.MOV, from: REGISTER.B, to: REGISTER.M,});
            expect(register.load(REGISTER.A)).to.eq(42);
            expect(register.load(REGISTER.B)).to.eq(21);
            expect(register.load(REGISTER.M)).to.eq(21);
        });

        it('should move M', () => {
            register.store(REGISTER.A, 1);
            register.store(REGISTER.B, 2);
            register.store(REGISTER.H, 0);
            register.store(REGISTER.L, 0);
            register.store(REGISTER.M, 1);
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.M,});
            expect(register.load(REGISTER.A)).to.eq(1);
            expect(register.load(REGISTER.B)).to.eq(2);
            expect(register.load(REGISTER.H)).to.eq(0);
            expect(register.load(REGISTER.L)).to.eq(0);
            expect(register.load(REGISTER.M)).to.eq(1);


            register.store(REGISTER.H, 1);
            register.store(REGISTER.L, 1);
            executor.execute({type: OPERATION.MOV, from: REGISTER.B, to: REGISTER.M,});
            expect(register.load(REGISTER.A)).to.eq(1);
            expect(register.load(REGISTER.B)).to.eq(2);
            expect(register.load(REGISTER.H)).to.eq(1);
            expect(register.load(REGISTER.L)).to.eq(1);
            expect(register.load(REGISTER.M)).to.eq(2);


            register.store(REGISTER.H, 0);
            register.store(REGISTER.L, 0);
            expect(register.load(REGISTER.A)).to.eq(1);
            expect(register.load(REGISTER.B)).to.eq(2);
            expect(register.load(REGISTER.H)).to.eq(0);
            expect(register.load(REGISTER.L)).to.eq(0);
            expect(register.load(REGISTER.M)).to.eq(1);

            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.M,});
            expect(register.load(REGISTER.A)).to.eq(1);
            expect(register.load(REGISTER.B)).to.eq(2);
            expect(register.load(REGISTER.H)).to.eq(0);
            expect(register.load(REGISTER.L)).to.eq(0);
            expect(register.load(REGISTER.M)).to.eq(1);

        });

    });

    describe('exec test add', () => {

        beforeEach(() => {
            rebuild();
        });

        it('should add ', () => {
            register.store(REGISTER.A, 42);
            register.store(REGISTER.B, 42);
            register.setCarry(true);
            executor.execute({type: OPERATION.ADD, register: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(84);
            expect(register.load(REGISTER.B)).to.eq(42);
            expect(register.getCarry()).to.eq(false);
            expect(register.getParity()).to.eq(true);
        });

        it('should adc ', () => {
            register.store(REGISTER.A, 42);
            register.store(REGISTER.B, 42);
            register.setCarry(true);
            executor.execute({type: OPERATION.ADC, register: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(85);
            expect(register.load(REGISTER.B)).to.eq(42);
            expect(register.getCarry()).to.eq(false);
            expect(register.getParity()).to.eq(false);
        });
        it('should aci', () => {
            register.store(REGISTER.A, 42);
            register.setCarry(true);
            executor.execute({type: OPERATION.ACI, value: 1});
            expect(register.load(REGISTER.A)).to.eq(44);
            expect(register.getCarry()).to.eq(false);
        });
        it('should adi', () => {
            register.store(REGISTER.A, 42);
            register.setCarry(true);
            executor.execute({type: OPERATION.ADI, value: 1});
            expect(register.load(REGISTER.A)).to.eq(43);
            expect(register.getCarry()).to.eq(false);
            expect(register.getZero()).to.eq(false);
        });
        it('should add and set carry', () => {
            register.store(REGISTER.A, 128);
            register.store(REGISTER.B, 128);
            expect(register.load(REGISTER.B)).to.eq(128);
            register.setCarry(true);
            executor.execute({type: OPERATION.ADD, register: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(0);
            expect(register.load(REGISTER.B)).to.eq(128);
            expect(register.getCarry()).to.eq(true);
            expect(register.getZero()).to.eq(true);
        });
    });
    describe('exec test sub', () => {

        beforeEach(() => {
            rebuild();
        });

        it('should sub ', () => {
            register.store(REGISTER.A, 42);
            register.store(REGISTER.B, 40);
            register.setCarry(true);
            executor.execute({type: OPERATION.SUB, register: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(2);
            expect(register.load(REGISTER.B)).to.eq(40);
            expect(register.getCarry()).to.eq(false);
            expect(register.getParity()).to.eq(true);
        });

        it('should sbb ', () => {
            register.store(REGISTER.A, 42);
            register.store(REGISTER.B, 20);
            register.setCarry(true);
            executor.execute({type: OPERATION.SBB, register: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(21);
            expect(register.load(REGISTER.B)).to.eq(20);
            expect(register.getCarry()).to.eq(false);
            expect(register.getParity()).to.eq(true);
        });
        it('should sui', () => {
            register.store(REGISTER.A, 42);
            register.setCarry(true);
            executor.execute({type: OPERATION.SUI, value: 1});
            expect(register.load(REGISTER.A)).to.eq(41);
            expect(register.getCarry()).to.eq(false);
            expect(register.getZero()).to.eq(false);
        });
        it('should sbi', () => {
            register.store(REGISTER.A, 42);
            register.setCarry(true);
            executor.execute({type: OPERATION.SBI, value: 1});
            expect(register.load(REGISTER.A)).to.eq(40);
            expect(register.getCarry()).to.eq(false);
            expect(register.getZero()).to.eq(false);
        });
        it('should sub and set carry', () => {
            register.store(REGISTER.A, 128);
            register.store(REGISTER.B, 128);
            expect(register.load(REGISTER.B)).to.eq(128);
            register.setCarry(true);
            executor.execute({type: OPERATION.SUB, register: REGISTER.B,});
            expect(register.load(REGISTER.A)).to.eq(0);
            expect(register.load(REGISTER.B)).to.eq(128);
            expect(register.getCarry()).to.eq(false);
            expect(register.getZero()).to.eq(true);
        });

    });
    describe('exec test sub', () => {

        beforeEach(() => {
            rebuild();
        });
        it('should inr 127', () => {
            const num = 127;
            const reg = REGISTER.B;
            const expected = (num + 1) & BYTE_MAX;
            register.store(reg, num);
            register.setCarry(true);
            executor.execute({type: OPERATION.INR, register: reg});
            expect(register.load(reg)).to.eq(expected);
            expect(register.getCarry()).to.eq(true);
            expect(register.getZero()).to.eq(calcZero(expected));
            expect(register.getParity()).to.eq(calcParity(expected));
            expect(register.getSign()).to.eq(calcSign(expected), expected + '');
        });
        it('should inr 0', () => {
            const num = 0;
            const reg = REGISTER.B;
            const expected = (num + 1) & BYTE_MAX;
            register.store(reg, num);
            register.setCarry(true);
            executor.execute({type: OPERATION.INR, register: reg});
            expect(register.load(reg)).to.eq(expected);
            expect(register.getCarry()).to.eq(true);
            expect(register.getZero()).to.eq(calcZero(expected));
            expect(register.getParity()).to.eq(calcParity(expected));
            expect(register.getSign()).to.eq(calcSign(expected), expected + '');
        });


        it('should inr', () => {
            registerList.forEach(reg => {
                [0, 1, 127, 128, 255, 254].forEach(num => {
                    rebuild();
                    const expected = (num + 1) & BYTE_MAX;
                    register.store(reg, num);
                    register.setCarry(true);
                    executor.execute({type: OPERATION.INR, register: reg});
                    const actual = register.load(reg);
                    expect(actual).to.eq(expected, JSON.stringify({actual, expected, num, reg}));
                    expect(register.getCarry()).to.eq(true);
                    expect(register.getZero()).to.eq(calcZero(expected));
                    expect(register.getParity()).to.eq(calcParity(expected));
                    expect(register.getSign()).to.eq(calcSign(expected), expected + '');
                });
            })
        });

        it('should dec ', () => {
            registerList.forEach(reg => {
                [0, 1, 127, 128, 255, 254].forEach(num => {
                    rebuild();
                    const expected = (num - 1) & BYTE_MAX;
                    register.store(reg, num);
                    register.setCarry(true);
                    executor.execute({type: OPERATION.DCR, register: reg});
                    const actual = register.load(reg);
                    expect(actual).to.eq(expected, JSON.stringify({actual, expected, num, reg}));
                    expect(register.getCarry()).to.eq(true);
                    expect(register.getZero()).to.eq(calcZero(expected));
                    expect(register.getParity()).to.eq(calcParity(expected));
                    expect(register.getSign()).to.eq(calcSign(expected));
                });
            })
        });

        it('should inc M', () => {
            const num = 255;
            const reg = REGISTER.M;
            const expected = 0 & BYTE_MAX;
            register.store(reg, num);
            register.setCarry(true);
            executor.execute({type: OPERATION.INR, register: reg});
            expect(register.load(reg)).to.eq(expected);
            expect(register.getCarry()).to.eq(true);
            expect(register.getZero()).to.eq(calcZero(expected));
            expect(register.getParity()).to.eq(calcParity(expected));
            expect(register.getSign()).to.eq(calcSign(expected), expected + '');
        });
    });
    describe('test stack', () => {

        beforeEach(() => {
            rebuild();
        });


        it('should push B and pop D', () => {

            register.store(REGISTER.B, 12);
            register.store(REGISTER.C, 21);
            executor.execute({type: OPERATION.PUSH, register: REGISTER.B});
            register.store(REGISTER.B, 0);
            register.store(REGISTER.C, 0);

            expect(register.load(REGISTER.B)).to.eq(0);
            expect(register.load(REGISTER.C)).to.eq(0);
            expect(register.load(REGISTER.D)).to.eq(0);
            expect(register.load(REGISTER.E)).to.eq(0);

            executor.execute({type: OPERATION.POP, register: REGISTER.D});
            expect(register.load(REGISTER.B)).to.eq(0);
            expect(register.load(REGISTER.C)).to.eq(0);
            expect(register.load(REGISTER.D)).to.eq(12);
            expect(register.load(REGISTER.E)).to.eq(21);
        });

        it('should push D and pop D', () => {

            register.store(REGISTER.D, 12);
            register.store(REGISTER.E, 21);
            executor.execute({type: OPERATION.PUSH, register: REGISTER.D});
            register.store(REGISTER.D, 0);
            register.store(REGISTER.E, 0);

            expect(register.load(REGISTER.B)).to.eq(0);
            expect(register.load(REGISTER.C)).to.eq(0);
            expect(register.load(REGISTER.D)).to.eq(0);
            expect(register.load(REGISTER.E)).to.eq(0);

            executor.execute({type: OPERATION.POP, register: REGISTER.B});
            expect(register.load(REGISTER.D)).to.eq(0);
            expect(register.load(REGISTER.E)).to.eq(0);
            expect(register.load(REGISTER.B)).to.eq(12);
            expect(register.load(REGISTER.C)).to.eq(21);
        });

        it('should push PSW and pop B', () => {
            {
                register.store(REGISTER.A, 12);
                register.setCarry(true);
                register.setZero(true);
                register.setSign(false);
                register.setParity(true);
                register.setAuxiliary(false);
            }
            {
                executor.execute({type: OPERATION.PUSH, register: REGISTER.PSW});
                expect(register.load(REGISTER.A)).to.eq(12);
                expect(register.getZero()).to.eq(true);
                expect(register.getCarry()).to.eq(true);
                expect(register.getSign()).to.eq(false);
                expect(register.getParity()).to.eq(true);
                expect(register.getAuxiliary()).to.eq(false);
            }
            {
                register.store(REGISTER.A, 0);
                register.setCarry(false);
                register.setZero(false);
                register.setSign(false);
                register.setParity(false);
                register.setAuxiliary(false);
            }
            {
                expect(register.load(REGISTER.A)).to.eq(0);
                expect(register.getZero()).to.eq(false);
                expect(register.getCarry()).to.eq(false);
                expect(register.getSign()).to.eq(false);
                expect(register.getParity()).to.eq(false);
                expect(register.getAuxiliary()).to.eq(false);
            }
            {
                executor.execute({type: OPERATION.POP, register: REGISTER.PSW});
                expect(register.load(REGISTER.A)).to.eq(12);
                expect(register.getZero()).to.eq(true);
                expect(register.getCarry()).to.eq(true);
                expect(register.getSign()).to.eq(false);
                expect(register.getParity()).to.eq(true);
                expect(register.getAuxiliary()).to.eq(false);
            }

        });

    });


});
