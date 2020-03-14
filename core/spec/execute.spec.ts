import * as reg from "../impl/register";
import * as mem from "../impl/memory";
import * as alu from "../impl/alu";
import * as exec from "../impl/execute";
import {XCMAP} from "../impl/execute";
import {IExecute} from "../interface/execute";
import {HighLow, IRegister, REGISTER, registerList} from "../interface/register";
import {OPERATION} from "../interface/operation/operation.types";
import {expect} from "chai";
import {BYTE_MAX} from "../util/bits";
import {calcParity, calcSign, calcZero} from "../util/flag.function";
import {HighLowFN} from "../util/high-low.function";
import {IMemory} from "../interface/memory";
import {xDecrement, xIncrement} from "../util/arithmetic";

const toHighLow = HighLowFN.toHighLow
const highLow = HighLowFN.highLow

const binary = (s: string) => parseInt(s, 2);

let executor: IExecute;
let register: IRegister;
let memory: IMemory;

function randomFlag(): boolean {
    return Math.random() > .5;
}

function testRandomSZAPFlags(it: () => void) {
    const zero = randomFlag()
    register.setZero(zero)
    const aux = randomFlag()
    register.setAuxiliary(aux)
    const parity = randomFlag()
    register.setParity(parity)
    const sign = randomFlag()
    register.setSign(sign)

    it();
    expect(register.getZero()).to.eq(zero);
    expect(register.getAuxiliary()).to.eq(aux);
    expect(register.getParity()).to.eq(parity);
    expect(register.getSign()).to.eq(sign);
}

function testRandomFlags(it: () => void) {
    const carry = randomFlag()
    register.setCarry(carry)
    testRandomSZAPFlags(it);
    expect(register.getCarry()).to.eq(carry);
}

function rebuild() {
    memory = mem.build();
    register = reg.build(memory);
    executor = exec.build(register, alu.build(), memory);
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

    describe('exec test logic', () => {

        beforeEach(() => {
            rebuild();
        });
        it('should or ', () => {

            const a = binary('10010010');
            const b = binary('10100110');
            const r = binary('10110110');

            register.store(REGISTER.A, a);
            register.store(REGISTER.B, b);
            executor.execute({type: OPERATION.ORA, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(r, [a, b, r].join());

        });
        it('should and ', () => {

            const a = binary('10010010');
            const b = binary('10100110');
            const r = binary('10000010');
            register.store(REGISTER.A, a);
            register.store(REGISTER.B, b);
            executor.execute({type: OPERATION.ANA, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(r, [a, b, r].join());
        });

        it('should xor ', () => {
            const a = binary('10010010');
            const b = binary('10100110');
            const r = binary('00110100');
            register.store(REGISTER.A, a);
            register.store(REGISTER.B, b);
            executor.execute({type: OPERATION.XRA, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(r, [a, b, r].join());
        });
        it('should or i', () => {

            const a = binary('10010010');
            const b = binary('10100110');
            const r = binary('10110110');

            register.store(REGISTER.A, a);
            executor.execute({type: OPERATION.ORI, value: b});
            expect(register.load(REGISTER.A)).to.eq(r, [a, b, r].join());

        });
        it('should and i', () => {

            const a = binary('10010010');
            const b = binary('10100110');
            const r = binary('10000010');
            register.store(REGISTER.A, a);
            executor.execute({type: OPERATION.ANI, value: b});
            expect(register.load(REGISTER.A)).to.eq(r, [a, b, r].join());
        });

        it('should xor i', () => {
            const a = binary('10010010');
            const b = binary('10100110');
            const r = binary('00110100');
            register.store(REGISTER.A, a);
            executor.execute({type: OPERATION.XRI, value: b});
            expect(register.load(REGISTER.A)).to.eq(r, [a, b, r].join());
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

        it('should CMP ', () => {
            register.store(REGISTER.A, 42);
            register.store(REGISTER.B, 41);
            register.store(REGISTER.C, 42);
            register.store(REGISTER.D, 43);
            register.setCarry(true);
            register.setZero(true);
            {
                executor.execute({type: OPERATION.CMP, register: REGISTER.B,});
                expect(register.getCarry()).to.eq(false);
                expect(register.getZero()).to.eq(false);
            }
            {
                executor.execute({type: OPERATION.CMP, register: REGISTER.C,});
                expect(register.getCarry()).to.eq(false);
                expect(register.getZero()).to.eq(true);
            }
            {
                executor.execute({type: OPERATION.CMP, register: REGISTER.D,});
                expect(register.getCarry()).to.eq(true);
                expect(register.getZero()).to.eq(false);
            }
            {
                expect(register.load(REGISTER.A)).to.eq(42);
                expect(register.load(REGISTER.B)).to.eq(41);
                expect(register.load(REGISTER.C)).to.eq(42);
                expect(register.load(REGISTER.D)).to.eq(43);
            }


        });
        //
        it('should CPI ', () => {
            register.store(REGISTER.A, 42);
            register.setCarry(true);
            register.setZero(true);
            {
                executor.execute({type: OPERATION.CPI, value: 41});
                expect(register.load(REGISTER.A)).to.eq(42);
                expect(register.getCarry()).to.eq(false);
                expect(register.getZero()).to.eq(false);
            }
            {
                executor.execute({type: OPERATION.CPI, value: 42});
                expect(register.load(REGISTER.A)).to.eq(42);
                expect(register.getCarry()).to.eq(false);
                expect(register.getZero()).to.eq(true);
            }
            {
                executor.execute({type: OPERATION.CPI, value: 43});
                expect(register.load(REGISTER.A)).to.eq(42);
                expect(register.getCarry()).to.eq(true);
                expect(register.getZero()).to.eq(false);
            }
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
    describe('test alu-misc', () => {

        beforeEach(() => {
            rebuild();
        });

        it('should adjust decimal 17 + 17', () => {

            register.store(REGISTER.A, 0x17);
            register.store(REGISTER.B, 0x17);
            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(0x2E);
            executor.execute({type: OPERATION.DAA});
            expect(register.load(REGISTER.A)).to.eq(0x34);
            expect(register.getCarry()).to.eq(false);

        });

        it('should adjust decimal 71 + 71', () => {

            register.store(REGISTER.A, 0x71);
            register.store(REGISTER.B, 0x71);
            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(226);
            executor.execute({type: OPERATION.DAA});
            expect(register.load(REGISTER.A)).to.eq(0x42);
            expect(register.getCarry()).to.eq(true);

        });
        it('should adjust decimal 77 + 77', () => {

            register.store(REGISTER.A, 0x77);
            register.store(REGISTER.B, 0x77);
            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(238);
            executor.execute({type: OPERATION.DAA});
            expect(register.load(REGISTER.A)).to.eq(0x54);
            expect(register.getCarry()).to.eq(true);

        });
        it('should adjust decimal 11 + 11', () => {

            register.store(REGISTER.A, 0x11);
            register.store(REGISTER.B, 0x11);
            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            expect(register.load(REGISTER.A)).to.eq(0x22);
            executor.execute({type: OPERATION.DAA});
            expect(register.load(REGISTER.A)).to.eq(0x22);
            expect(register.getCarry()).to.eq(false);

        });

    });
    describe('test misc', () => {

        beforeEach(() => {
            rebuild();
        });

        it('NOP', () => {
            testRandomSZAPFlags(() => {
                register.store(REGISTER.A, 234);
                executor.execute({type: OPERATION.NOP});
                expect(register.load(REGISTER.A)).to.eq(234);
            });
        });

    });
    describe('jumps', () => {

        beforeEach(() => {
            rebuild();
        });

        it('should PCHL', () => {

            const position = highLow(23, 45)
            register.storeX(REGISTER.H, position)
            executor.execute({type: OPERATION.PCHL});
            expect(register.getProgramCounter()).to.eql(position);


        });
        it('should JMP', () => {

            const position = highLow(23, 45)
            executor.execute({type: OPERATION.JMP, position});
            expect(register.getProgramCounter()).to.eql(position);


        });
        it('should JNZ', () => {

            const position = highLow(23, 45)
            register.setZero(true);
            executor.execute({type: OPERATION.JNZ, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setZero(false);
            executor.execute({type: OPERATION.JNZ, position});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should JZ', () => {

            const position = highLow(23, 45)
            register.setZero(false);
            executor.execute({type: OPERATION.JZ, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setZero(true);
            executor.execute({type: OPERATION.JZ, position});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should JNC', () => {

            const position = highLow(23, 45)
            register.setCarry(true);
            executor.execute({type: OPERATION.JNC, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setCarry(false);
            executor.execute({type: OPERATION.JNC, position});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should JC', () => {

            const position = highLow(23, 45)
            register.setCarry(false);
            executor.execute({type: OPERATION.JC, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setCarry(true);
            executor.execute({type: OPERATION.JC, position});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should JPO', () => {
            const position = highLow(23, 45)
            register.setParity(false);
            executor.execute({type: OPERATION.JPO, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setParity(true);
            executor.execute({type: OPERATION.JPO, position});
            expect(register.getProgramCounter()).to.eql(position);

        });

        it('should JPE', () => {
            const position = highLow(23, 45)
            register.setParity(true);
            executor.execute({type: OPERATION.JPE, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setParity(false);
            executor.execute({type: OPERATION.JPE, position});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should JM', () => {
            const position = highLow(23, 45)
            register.setSign(false);
            executor.execute({type: OPERATION.JM, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setSign(true);
            executor.execute({type: OPERATION.JM, position});
            expect(register.getProgramCounter()).to.eql(position);

        });

        it('should JP', () => {
            const position = highLow(23, 45)
            register.setSign(true);
            executor.execute({type: OPERATION.JP, position});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setSign(false);
            executor.execute({type: OPERATION.JP, position});
            expect(register.getProgramCounter()).to.eql(position);

        });
    });
    describe('call', () => {

        beforeEach(() => {
            rebuild();
        });


        function checkCall(initialPosition: HighLow, call: () => void) {

            register.setProgramCounter(initialPosition);
            const oldStackPointer = register.getStackPointer();
            const oldStackPointerM1 = xDecrement(oldStackPointer);
            const oldStackPointerM2 = xDecrement(oldStackPointerM1);

            call();

            expect(register.getStackPointer()).to.eql(oldStackPointerM2);
            expect(register.pop()).to.eql(initialPosition);
        }

        it('should CALL', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45);
                executor.execute({type: OPERATION.CALL, position});
                expect(register.getProgramCounter()).to.eql(position);
            })


        });
        it('should CNZ', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45)
                register.setZero(true);
                executor.execute({type: OPERATION.CNZ, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setZero(false);
                executor.execute({type: OPERATION.CNZ, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });
        it('should CZ', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {

                const position = highLow(23, 45)
                register.setZero(false);
                executor.execute({type: OPERATION.CZ, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setZero(true);
                executor.execute({type: OPERATION.CZ, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });
        it('should CNC', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45)
                register.setCarry(true);
                executor.execute({type: OPERATION.CNC, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setCarry(false);
                executor.execute({type: OPERATION.CNC, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });
        it('should CC', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {

                const position = highLow(23, 45)
                register.setCarry(false);
                executor.execute({type: OPERATION.CC, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setCarry(true);
                executor.execute({type: OPERATION.CC, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });
        it('should CPO', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45)
                register.setParity(false);
                executor.execute({type: OPERATION.CPO, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setParity(true);
                executor.execute({type: OPERATION.CPO, position});
                expect(register.getProgramCounter()).to.eql(highLow(23, 45));

            });
        });

        it('should CPE', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45)
                register.setParity(true);
                executor.execute({type: OPERATION.CPE, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setParity(false);
                executor.execute({type: OPERATION.CPE, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });
        it('should CM', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45)
                register.setSign(false);
                executor.execute({type: OPERATION.CM, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setSign(true);
                executor.execute({type: OPERATION.CM, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });

        it('should CP', () => {
            const initialPosition = highLow(12, 34);
            checkCall(initialPosition, () => {
                const position = highLow(23, 45)
                register.setSign(true);
                executor.execute({type: OPERATION.CP, position});
                expect(register.getProgramCounter()).to.eql(initialPosition);
                register.setSign(false);
                executor.execute({type: OPERATION.CP, position});
                expect(register.getProgramCounter()).to.eql(position);

            });
        });
    });
    describe('return', () => {

        beforeEach(() => {
            rebuild();
        });


        it('should RET', () => {

            const position = highLow(23, 45)
            expect(register.push(position));
            executor.execute({type: OPERATION.RET});
            expect(register.getProgramCounter()).to.eql(position);


        });
        it('should RNZ', () => {

            const position = highLow(23, 45)
            expect(register.push(position));
            expect(register.push(position));
            register.setZero(true);
            executor.execute({type: OPERATION.RNZ});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setZero(false);
            executor.execute({type: OPERATION.RNZ});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should RZ', () => {

            const position = highLow(23, 45)
            expect(register.push(position));
            register.setZero(false);
            executor.execute({type: OPERATION.RZ});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setZero(true);
            executor.execute({type: OPERATION.RZ});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should RNC', () => {

            const position = highLow(23, 45)
            expect(register.push(position));
            register.setCarry(true);
            executor.execute({type: OPERATION.RNC});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setCarry(false);
            executor.execute({type: OPERATION.RNC});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should RC', () => {

            const position = highLow(23, 45)
            expect(register.push(position));
            register.setCarry(false);
            executor.execute({type: OPERATION.RC});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setCarry(true);
            executor.execute({type: OPERATION.RC});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should RPO', () => {
            const position = highLow(23, 45)
            expect(register.push(position));
            register.setParity(false);
            executor.execute({type: OPERATION.RPO});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setParity(true);
            executor.execute({type: OPERATION.RPO});
            expect(register.getProgramCounter()).to.eql(position);

        });

        it('should RPE', () => {
            const position = highLow(23, 45)
            expect(register.push(position));
            register.setParity(true);
            executor.execute({type: OPERATION.RPE});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setParity(false);
            executor.execute({type: OPERATION.RPE});
            expect(register.getProgramCounter()).to.eql(position);

        });
        it('should RM', () => {
            const position = highLow(23, 45)
            expect(register.push(position));
            register.setSign(false);
            executor.execute({type: OPERATION.RM});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setSign(true);
            executor.execute({type: OPERATION.RM});
            expect(register.getProgramCounter()).to.eql(position);

        });

        it('should RP', () => {
            const position = highLow(23, 45)
            expect(register.push(position));
            register.setSign(true);
            executor.execute({type: OPERATION.RP});
            expect(register.getProgramCounter()).to.eql(toHighLow(0));
            register.setSign(false);
            executor.execute({type: OPERATION.RP});
            expect(register.getProgramCounter()).to.eql(position);

        });
    });
    describe('test alu-misc', () => {

        beforeEach(() => {
            rebuild();
        });

        it('should calculate complement', () => {
            const a = binary('10101001');
            const b = binary('01010110');

            register.store(REGISTER.A, a);
            executor.execute({type: OPERATION.CMA});
            expect(register.load(REGISTER.A)).to.eq(b);

        });

        it('should do carry flag operations', () => {
            register.setCarry(false);
            expect(register.getCarry()).to.eq(false);
            executor.execute({type: OPERATION.CMC});
            expect(register.getCarry()).to.eq(true);
            executor.execute({type: OPERATION.CMC});
            expect(register.getCarry()).to.eq(false);
            executor.execute({type: OPERATION.STC});
            expect(register.getCarry()).to.eq(true);

        });
    });

    describe('test rotation left', () => {

        beforeEach(() => {
            rebuild();
        });
        it('should rotate left 10001001', () => {
            const a = binary('10001001');
            const b = binary('00010011');

            register.store(REGISTER.A, a);
            register.setCarry(false);

            executor.execute({type: OPERATION.RLC});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(true)

        });
        it('should rotate right 00010011', () => {
            const a = binary('00010011');
            const b = binary('00100110');

            register.store(REGISTER.A, a);
            register.setCarry(true);

            executor.execute({type: OPERATION.RLC});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(false)

        });
        it('should rotate right through carry 10001001 0', () => {
            const a = binary('10001001');
            const b = binary('00010010');

            register.store(REGISTER.A, a);
            register.setCarry(false);

            executor.execute({type: OPERATION.RAL});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(true)

        });
        it('should rotate right through carry 10001001 1', () => {
            const a = binary('10001001');
            const b = binary('00010011');

            register.store(REGISTER.A, a);
            register.setCarry(true);

            executor.execute({type: OPERATION.RAL});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(true)

        });
        it('should rotate right through carry 00010011 0', () => {
            const a = binary('00010011');
            const b = binary('00100110');

            register.store(REGISTER.A, a);
            register.setCarry(false);

            executor.execute({type: OPERATION.RAL});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(false)

        });
        it('should rotate right through carry  00010011 1', () => {
            const a = binary('00010011');
            const b = binary('00100111');

            register.store(REGISTER.A, a);
            register.setCarry(true);

            executor.execute({type: OPERATION.RAL});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(false)

        })
    });
    describe('test rotation right', () => {

        beforeEach(() => {
            rebuild();
        });
        it('should rotate right 10001001', () => {
            const a = binary('10001001');
            const b = binary('11000100');

            register.store(REGISTER.A, a);
            register.setCarry(false);

            executor.execute({type: OPERATION.RRC});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(true)

        });
        it('should rotate right 00010010', () => {
            const a = binary('00010010');
            const b = binary('00001001');

            register.store(REGISTER.A, a);
            register.setCarry(true);

            executor.execute({type: OPERATION.RRC});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(false)

        });
        it('should rotate right through carry  00010010 1', () => {
            const a = binary('10001001');
            const b = binary('01000100');

            register.store(REGISTER.A, a);
            register.setCarry(false);

            executor.execute({type: OPERATION.RAR});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(true)

        });
        it('should rotate right through carry  10001001 1', () => {
            const a = binary('10001001');
            const b = binary('11000100');

            register.store(REGISTER.A, a);
            register.setCarry(true);

            executor.execute({type: OPERATION.RAR});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(true)

        });
        it('should rotate right through carry 00010010 0', () => {
            const a = binary('00010010');
            const b = binary('00001001');

            register.store(REGISTER.A, a);
            register.setCarry(false);

            executor.execute({type: OPERATION.RAR});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(false)

        });
        it('should rotate right through carry  00010010 1', () => {
            const a = binary('00010010');
            const b = binary('10001001');

            register.store(REGISTER.A, a);
            register.setCarry(true);

            executor.execute({type: OPERATION.RAR});
            expect(register.load(REGISTER.A)).to.eq(b);
            expect(register.getCarry()).to.eql(false)

        })
    });

    describe('test 16bit', () => {

        beforeEach(() => {
            rebuild();
        });


        it('should DAD B', () => {
            testRandomSZAPFlags(() => {
                register.storeX(REGISTER.B, toHighLow(1510));
                register.storeX(REGISTER.H, toHighLow(4365));

                executor.execute({type: OPERATION.DAD, register: REGISTER.B});

                expect(register.loadX(REGISTER.B)).to.eql(toHighLow(1510));
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(5875));

            });
        });
        it('should DAD D', () => {
            testRandomSZAPFlags(() => {
                register.storeX(REGISTER.D, toHighLow(0x8510));
                register.storeX(REGISTER.H, toHighLow(0x8365));

                executor.execute({type: OPERATION.DAD, register: REGISTER.D});

                expect(register.loadX(REGISTER.D)).to.eql(toHighLow(0x8510));
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(0x0875));
                expect(register.getCarry()).to.eql(true)

            });
        });

        it('should DAD H', () => {
            testRandomSZAPFlags(() => {
                register.storeX(REGISTER.H, toHighLow(4365));

                executor.execute({type: OPERATION.DAD, register: REGISTER.H});

                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(8730));
                expect(register.getCarry()).to.eql(false)

            });
        });
        it('should DAD SP', () => {
            testRandomSZAPFlags(() => {
                register.setStackPointer(toHighLow(1510));
                register.storeX(REGISTER.H, toHighLow(4365));

                executor.execute({type: OPERATION.DAD, register: REGISTER.SP});
                expect(register.getStackPointer()).to.eql(toHighLow(1510));
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(5875));
                expect(register.getCarry()).to.eql(false)
            });
        });

        it('should INX B', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.B, toHighLow(1510));
                executor.execute({type: OPERATION.INX, register: REGISTER.B});
                expect(register.loadX(REGISTER.B)).to.eql(toHighLow(1511));

            });
        });
        it('should INX D', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.D, toHighLow(1510));
                executor.execute({type: OPERATION.INX, register: REGISTER.D});
                expect(register.loadX(REGISTER.D)).to.eql(toHighLow(1511));

            });
        });
        it('should INX H', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.H, toHighLow(1510));
                executor.execute({type: OPERATION.INX, register: REGISTER.H});
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(1511));

            });
        });
        it('should INX H + C', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.H, toHighLow(0xffff));
                executor.execute({type: OPERATION.INX, register: REGISTER.H});
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(0));

            });
        });
        it('should INX SP', () => {
            testRandomFlags(() => {
                register.setStackPointer(toHighLow(1510));
                executor.execute({type: OPERATION.INX, register: REGISTER.SP});
                expect(register.getStackPointer()).to.eql(toHighLow(1511));
            });
        });
        it('should DCX B', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.B, toHighLow(1512));
                executor.execute({type: OPERATION.DCX, register: REGISTER.B});
                expect(register.loadX(REGISTER.B)).to.eql(toHighLow(1511));

            });
        });
        it('should DCX D', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.D, toHighLow(1512));
                executor.execute({type: OPERATION.DCX, register: REGISTER.D});
                expect(register.loadX(REGISTER.D)).to.eql(toHighLow(1511));

            });
        });
        it('should DCX H', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.H, toHighLow(1512));
                executor.execute({type: OPERATION.DCX, register: REGISTER.H});
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(1511));

            });
        });
        it('should DCX H', () => {
            testRandomFlags(() => {
                register.storeX(REGISTER.H, toHighLow(0));
                executor.execute({type: OPERATION.DCX, register: REGISTER.H});
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(0xffff));

            });
        });
        it('should DCX SP', () => {
            testRandomFlags(() => {
                register.setStackPointer(toHighLow(1512));
                executor.execute({type: OPERATION.DCX, register: REGISTER.SP});
                expect(register.getStackPointer()).to.eql(toHighLow(1511));
            });
        });


        it('should LXI B', () => {
            testRandomFlags(() => {
                executor.execute({type: OPERATION.LXI, register: REGISTER.B, value: toHighLow(1512)});
                expect(register.loadX(REGISTER.B)).to.eql(toHighLow(1512));

            });
        });
        it('should LXI D', () => {
            testRandomFlags(() => {
                executor.execute({type: OPERATION.LXI, register: REGISTER.D, value: toHighLow(1512)});
                expect(register.loadX(REGISTER.D)).to.eql(toHighLow(1512));

            });
        });
        it('should LXI H', () => {
            testRandomFlags(() => {
                executor.execute({type: OPERATION.LXI, register: REGISTER.H, value: toHighLow(1512)});
                expect(register.loadX(REGISTER.H)).to.eql(toHighLow(1512));

            });
        });
        it('should LXI SP', () => {
            testRandomFlags(() => {
                executor.execute({type: OPERATION.LXI, register: REGISTER.SP, value: toHighLow(1512)});
                expect(register.getStackPointer()).to.eql(toHighLow(1512));
            });
        });

        it('should LDAX B', () => {
            testRandomFlags(() => {
                const addr = toHighLow(1465)
                const val = 42;
                memory.store(addr, val)
                register.storeX(REGISTER.B, addr)
                executor.execute({type: OPERATION.LDAX, register: REGISTER.B});
                expect(register.load(REGISTER.A)).to.eql(val);
            });
        });

        it('should LDAX D', () => {
            testRandomFlags(() => {
                const addr = toHighLow(1465)
                const val = 42;
                memory.store(addr, val)
                register.storeX(REGISTER.D, addr)
                executor.execute({type: OPERATION.LDAX, register: REGISTER.D});
                expect(register.load(REGISTER.A)).to.eql(val);
            });
        });
        it('should LDA', () => {
            testRandomFlags(() => {
                const addr = toHighLow(1465)
                const val = 42;
                memory.store(addr, val)
                executor.execute({type: OPERATION.LDA, value: addr});
                expect(register.load(REGISTER.A)).to.eql(val);
            });
        });


        it('should STAX B', () => {
            testRandomFlags(() => {
                const addr = toHighLow(1465)
                const val = 42;
                register.store(REGISTER.A, val)
                register.storeX(REGISTER.B, addr)
                executor.execute({type: OPERATION.STAX, register: REGISTER.B});
                expect(memory.load(addr)).to.eql(val);
            });
        });


        it('should STAX D', () => {
            testRandomFlags(() => {
                const addr = toHighLow(1465)
                const val = 42;
                register.store(REGISTER.A, val)
                register.storeX(REGISTER.D, addr)
                executor.execute({type: OPERATION.STAX, register: REGISTER.D});
                expect(memory.load(addr)).to.eql(val);
            });
        });

        it('should STA', () => {
            testRandomFlags(() => {
                const addr = toHighLow(1465)
                const val = 42;
                register.store(REGISTER.A, val)
                executor.execute({type: OPERATION.STA, value: addr});
                expect(memory.load(addr)).to.eql(val);
            });
        });

        it('should SHLD', () => {
            testRandomFlags(() => {
                const addrA = highLow(0x1, 0x0A)
                const addrB = highLow(0x1, 0x0B)
                const val = highLow(0xae, 0x29)
                register.storeX(REGISTER.H, val)
                executor.execute({type: OPERATION.SHLD, value: addrA});
                expect(memory.load(addrA)).to.eql(val.low);
                expect(memory.load(addrB)).to.eql(val.high);
            });
        });


        it('should LHLD', () => {
            testRandomFlags(() => {
                const addrA = highLow(0x1, 0x0A)
                const addrB = highLow(0x1, 0x0B)
                const val = highLow(0xae, 0x29)

                memory.store(addrA, val.low);
                memory.store(addrB, val.high);

                executor.execute({type: OPERATION.LHLD, value: addrA});
                expect(register.loadX(REGISTER.H)).to.eql(val);
            });
        });
        it('should SPHL', () => {
            testRandomFlags(() => {

                const val = highLow(0xae, 0x29)
                register.storeX(REGISTER.H, val)
                executor.execute({type: OPERATION.SPHL});
                expect(register.loadX(REGISTER.H)).to.eql(val);
                expect(register.getStackPointer()).to.eql(val);
            });
        });
        it('should XCHG', () => {

            const valA = highLow(0xae, 0x29)
            const valB = highLow(0xf5, 0x34)
            register.storeX(REGISTER.D, valA)
            register.storeX(REGISTER.H, valB)
            executor.execute({type: OPERATION.XCHG});
            expect(register.loadX(REGISTER.H)).to.eql(valA);
            expect(register.loadX(REGISTER.D)).to.eql(valB);
            executor.execute({type: OPERATION.XCHG});
            expect(register.loadX(REGISTER.H)).to.eql(valB);
            expect(register.loadX(REGISTER.D)).to.eql(valA);
        });
        it('should XTHL', () => {
            testRandomFlags(() => {

                const valA = highLow(0xae, 0x29)
                const valB = highLow(0xae, 0x29)
                const addressA = highLow(0x43, 0x45)
                const addressB = highLow(0x43, 0x46)

                memory.store(addressA, valA.low);
                memory.store(addressB, valA.high);

                register.setStackPointer(addressA)
                register.storeX(REGISTER.H, valB)
                executor.execute({type: OPERATION.XTHL});


                expect(register.loadX(REGISTER.H)).to.eql(valA);
                expect(register.getStackPointer()).to.eql(addressA);
                expect(memory.load(register.getStackPointer())).to.eql(valB.low);
                expect(memory.load(xIncrement(register.getStackPointer()))).to.eql(valB.high);

                executor.execute({type: OPERATION.XTHL});

                expect(register.loadX(REGISTER.H)).to.eql(valB);
                expect(register.getStackPointer()).to.eql(addressA);
                expect(memory.load(register.getStackPointer())).to.eql(valA.low);
                expect(memory.load(xIncrement(register.getStackPointer()))).to.eql(valA.high);

            });
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
    describe('mini program', () => {

        beforeEach(() => {
            rebuild();
        });
        it('fibonacci', () => {
            executor.execute({type: OPERATION.MVI, value: 1, to: REGISTER.A});
            executor.execute({type: OPERATION.MVI, value: 1, to: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.C});
            expect(register.load(REGISTER.A)).to.eq(1)

            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.C, to: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.C});
            expect(register.load(REGISTER.A)).to.eq(2)

            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.C, to: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.C});
            expect(register.load(REGISTER.A)).to.eq(3)

            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.C, to: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.C});
            expect(register.load(REGISTER.A)).to.eq(5)

            executor.execute({type: OPERATION.ADD, register: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.C, to: REGISTER.B});
            executor.execute({type: OPERATION.MOV, from: REGISTER.A, to: REGISTER.C});

            expect(register.load(REGISTER.A)).to.eq(8)


        });
    });
    describe('summary', () => {

        beforeEach(() => {
            rebuild();
        });
        it('summary', () => {
            const missing = Object.entries(XCMAP).filter(([k, v]) => !v).map(([k, v]) => [v, k,])
            console.log(missing)
            console.log(missing.length + ' of ' + Object.entries(XCMAP).length + ' missing')
        });
    });


});
