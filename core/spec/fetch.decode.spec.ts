import 'mocha';
import {expect} from "chai";

import {IFetchDecode, IMemory, IRegister, OPERATION, OperationT, REGISTER, RegisterOperation} from "../interface";
import {buildFetch, buildMemory, buildRegister, XRMAP} from "../cpu";
import {HighLowFN, xIncrement} from "../util";

const toHighLow = HighLowFN.toHighLow;
const highLow = HighLowFN.highLow;
let memory: IMemory;
let register: IRegister;
let fetchDecode: IFetchDecode;

function printCX(XRMAP: { [p: number]: OperationT }) {
    let string = '';

    function pad(type: string, pad: number) {
        return type + ' '.repeat(pad - type.length);
    }

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            const val = XRMAP[i * 16 + j];
            string += val ? '| ' + pad(val.type, 4) : '|     '
        }
        string += '|\n'
    }

    console.log(string)


}

function reset() {
    memory = buildMemory();
    register = buildRegister(memory);
    fetchDecode = buildFetch(memory, register);

}

describe('fetch decode', () => {
    describe('fetch decode test', () => {


        beforeEach(() => {
            reset();
        });


        it('should RLC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x07);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RLC};
            expect(actual).to.eql(expected);
        });

        it('should RRC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x0f);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RRC};
            expect(actual).to.eql(expected);
        });

        it('should RAL', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x17);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RAL};
            expect(actual).to.eql(expected);
        });

        it('should RAR', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x1f);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RAR};
            expect(actual).to.eql(expected);
        });

        it('should DAA', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x27);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DAA};
            expect(actual).to.eql(expected);
        });

        it('should CMA', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x2f);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CMA};
            expect(actual).to.eql(expected);
        });

        it('should STC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x37);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.STC};
            expect(actual).to.eql(expected);
        });

        it('should CMC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x3f);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CMC};
            expect(actual).to.eql(expected);
        });


    });

    describe('mvi', () => {
        beforeEach(() => {
            reset();
        });

        it('should mvi B <- 0xDA', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x06);
            memory.store(xIncrement(memAddress), 0xDA);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.B, value: 0xDA};
            expect(actual).to.eql(expected);
        });
        it('should mvi C <- 0xDC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x0E);
            memory.store(xIncrement(memAddress), 0xDC);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.C, value: 0xDC};
            expect(actual).to.eql(expected);
        });

        it('should mvi D <- 0xDE', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x16);
            memory.store(xIncrement(memAddress), 0xDE);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.D, value: 0xDE};
            expect(actual).to.eql(expected);
        });

        it('should mvi E <- 0xDA', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x1E);
            memory.store(xIncrement(memAddress), 0xDA);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.E, value: 0xDA};
            expect(actual).to.eql(expected);
        });

        it('should mvi H <- 0x5B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x26);
            memory.store(xIncrement(memAddress), 0x5B);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.H, value: 0x5B};
            expect(actual).to.eql(expected);
        });

        it('should mvi L <- 0x5E', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x2E);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.L, value: 0x5E};
            expect(actual).to.eql(expected);
        });

        it('should mvi M <- 0x34', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x36);
            memory.store(xIncrement(memAddress), 0x34);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.M, value: 0x34};
            expect(actual).to.eql(expected);
        });

        it('should mvi A <- 54', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x3E);
            memory.store(xIncrement(memAddress), 54);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MVI, to: REGISTER.A, value: 54};
            expect(actual).to.eql(expected);
        });

    });

    describe('mov', () => {
        beforeEach(() => {
            reset();
        });

        it('should mov C <- D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x4A);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.D};
            expect(actual).to.eql(expected);
        });

        it('should mov M <- H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x74);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.H};
            expect(actual).to.eql(expected);
        });


        it('should move', () => {
            let memAddress = toHighLow(0);
            for (let i = 0x40; i < 0x80; i++) {
                memory.store(memAddress, i);
                memAddress = xIncrement(memAddress);
                const actual = fetchDecode.next();

                if (i === 0x76) {
                    const expected: OperationT = {type: OPERATION.HLT};
                    expect(actual).to.eql(expected);
                } else {
                    const expected: OperationT = {type: OPERATION.MOV, from: i & 7, to: i >> 3 & 7};
                    expect(actual).to.eql(expected);
                }

            }
        });


    });

    describe('nop', () => {
        beforeEach(() => {
            reset();
        });

        it('should nop', () => {
            let memAddress = toHighLow(0);
            for (let i of [
                0x00,
                0x10,
                0x20,
                0x30,
                0x08,
                0x18,
                0x28,
                0x38,
            ]) {
                memory.store(memAddress, i);
                memAddress = xIncrement(memAddress);

                const actual = fetchDecode.next();
                const expected: OperationT = {type: OPERATION.NOP};
                expect(actual).to.eql(expected);

            }
        });

    });

    describe('16bit', () => {
        beforeEach(() => {
            reset();
        });

        it('should DAD B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x09);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DAD, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });

        it('should DAD D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x19);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DAD, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });


        it('should DAD H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x29);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DAD, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });

        it('should DAD SP', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x39);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DAD, register: REGISTER.SP};
            expect(actual).to.eql(expected);
        });

        it('should INX B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x03);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INX, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });

        it('should INX D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x13);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INX, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });


        it('should INX H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x23);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INX, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });

        it('should INX SP', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x33);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INX, register: REGISTER.SP};
            expect(actual).to.eql(expected);
        });


        it('should DCX B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x0B);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCX, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });

        it('should DCX D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x1B);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCX, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });


        it('should DCX H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x2B);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCX, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });

        it('should DCX SP', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x3B);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCX, register: REGISTER.SP};
            expect(actual).to.eql(expected);
        });

    });

    describe('alu', () => {
        beforeEach(() => {
            reset();
        });

        it('should alu operation', () => {
            let memAddress = toHighLow(0);

            for (let i = 0x80; i < 0xC0; i++) {
                memory.store(memAddress, i);
                memAddress = xIncrement(memAddress);

                const actual: RegisterOperation & OperationT = fetchDecode.next() as RegisterOperation & OperationT;
                expect(actual.register).to.eql(i & 7);

                function between(a: number, b: number, op: OPERATION) {
                    const match = i >= a && i < b;
                    if (match) expect(actual.type).to.eql(op);
                    else expect(actual.type).not.to.eql(op);
                }

                between(0x80, 0x88, OPERATION.ADD);
                between(0x88, 0x90, OPERATION.ADC);
                between(0x90, 0x98, OPERATION.SUB);
                between(0x98, 0xA0, OPERATION.SBB);
                between(0xA0, 0xA8, OPERATION.ANA);
                between(0xA8, 0xB0, OPERATION.XRA);
                between(0xB0, 0xB8, OPERATION.ORA);
                between(0xB8, 0xC0, OPERATION.CMP);

            }
        });

        it('should ADI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc6);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.ADI, value: 0x5E};
            expect(actual).to.eql(expected);
        });

        it('should ACI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xce);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.ACI, value: 0x5E};
            expect(actual).to.eql(expected);
        });
        it('should SUI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd6);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.SUI, value: 0x5E};
            expect(actual).to.eql(expected);
        });

        it('should SBI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xde);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.SBI, value: 0x5E};
            expect(actual).to.eql(expected);
        });
        it('should ANI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe6);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.ANI, value: 0x5E};
            expect(actual).to.eql(expected);
        });

        it('should XRI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xee);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.XRI, value: 0x5E};
            expect(actual).to.eql(expected);
        });
        it('should ORI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf6);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.ORI, value: 0x5E};
            expect(actual).to.eql(expected);
        });

        it('should CPI', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xfe);
            memory.store(xIncrement(memAddress), 0x5E);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CPI, value: 0x5E};
            expect(actual).to.eql(expected);
        });

    });

    describe('increment', () => {


        beforeEach(() => {
            reset();
        });


        it('should INR B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x04);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });
        it('should INR C', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x0c);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.C};
            expect(actual).to.eql(expected);
        });
        it('should INR D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x14);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });
        it('should INR E', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x1c);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.E};
            expect(actual).to.eql(expected);
        });
        it('should INR H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x24);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });
        it('should INR L', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x2c);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.L};
            expect(actual).to.eql(expected);
        });
        it('should INR M', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x34);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.M};
            expect(actual).to.eql(expected);
        });
        it('should INR A', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x3c);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.INR, register: REGISTER.A};
            expect(actual).to.eql(expected);
        });


    });

    describe('decrement', () => {


        beforeEach(() => {
            reset();
        });


        it('should DCR B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x05);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });
        it('should DCR C', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x0d);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.C};
            expect(actual).to.eql(expected);
        });
        it('should DCR D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x15);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });
        it('should DCR E', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x1d);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.E};
            expect(actual).to.eql(expected);
        });
        it('should DCR H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x25);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });
        it('should DCR L', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x2d);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.L};
            expect(actual).to.eql(expected);
        });
        it('should DCR M', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x35);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.M};
            expect(actual).to.eql(expected);
        });
        it('should DCR A', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x3d);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.DCR, register: REGISTER.A};
            expect(actual).to.eql(expected);
        });


    });

    describe('fetch decode stack', () => {


        beforeEach(() => {
            reset();
        });

        it('should POP B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc1);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.POP, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });

        it('should POP D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd1);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.POP, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });

        it('should POP H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe1);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.POP, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });

        it('should POP PSW', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf1);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.POP, register: REGISTER.PSW};
            expect(actual).to.eql(expected);
        });

        it('should PUSH B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc5);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.PUSH, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });

        it('should PUSH D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd5);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.PUSH, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });

        it('should PUSH H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe5);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.PUSH, register: REGISTER.H};
            expect(actual).to.eql(expected);
        });

        it('should PUSH PSW', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf5);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.PUSH, register: REGISTER.PSW};
            expect(actual).to.eql(expected);
        });
    });

    describe('LDA(X) STA(X)', () => {


        beforeEach(() => {
            reset();
        });

        it('should STAX B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x02);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.STAX, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });

        it('should STAX D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x12);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.STAX, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });

        it('should LDAX B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x0a);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LDAX, register: REGISTER.B};
            expect(actual).to.eql(expected);
        });
        it('should LDAX D', () => {

            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x1a);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LDAX, register: REGISTER.D};
            expect(actual).to.eql(expected);
        });
        it('should XTHL', () => {

            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe3);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.XTHL};
            expect(actual).to.eql(expected);
        });
        it('should SPHL', () => {

            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf9);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.SPHL};
            expect(actual).to.eql(expected);
        });
        it('should XCHG', () => {

            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xeb);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.XCHG};
            expect(actual).to.eql(expected);
        });


        it('should LDA B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x3a);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LDA, value};
            expect(actual).to.eql(expected);
        });

        it('should LHLD', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x2a);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LHLD, value};
            expect(actual).to.eql(expected);
        });

        it('should STA B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x32);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.STA, value};
            expect(actual).to.eql(expected);
        });
        it('should SHLD', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x22);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.SHLD, value};
            expect(actual).to.eql(expected);
        });

    });

    describe('not implemented', () => {


        beforeEach(() => {
            reset();
        });

        it('should _', () => {
            [0xc7,
                0xd7,
                0xe7,
                0xf7,
                0xcf,
                0xdf,
                0xef,
                0xff,
                0xd3,
                0xdb,
                0xf3,
                0xfb,
            ].forEach(val => {
                reset();
                let memAddress = toHighLow(0);
                memory.store(memAddress, val);
                const actual = fetchDecode.next();
                const expected: OperationT = {type: OPERATION._};
                expect(actual).to.eql(expected, val.toString(16));
            })
        })

    });

    describe('LXI Load Register Pair Immediate', () => {


        beforeEach(() => {
            reset();
        });


        it('should LXI B', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x01);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LXI, register: REGISTER.B, value};
            expect(actual).to.eql(expected);
        });

        it('should LXI D', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x11);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LXI, register: REGISTER.D, value};
            expect(actual).to.eql(expected);
        });


        it('should LXI H', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x21);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LXI, register: REGISTER.H, value};
            expect(actual).to.eql(expected);
        });

        it('should LXI SP', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0x31);
            const value = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, value.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.LXI, register: REGISTER.SP, value};
            expect(actual).to.eql(expected);
        });
    });


    describe('fetch decode return', () => {

        beforeEach(() => {
            reset();
        });

        it('should RNZ', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc0);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RNZ};
            expect(actual).to.eql(expected);
        });
        it('should RNC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd0);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RNC};
            expect(actual).to.eql(expected);
        });
        it('should RPO', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe0);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RPO};
            expect(actual).to.eql(expected);
        });
        it('should RP', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf0);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RP};
            expect(actual).to.eql(expected);
        });
        it('should RZ', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc8);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RZ};
            expect(actual).to.eql(expected);
        });
        it('should RC', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd8);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RC};
            expect(actual).to.eql(expected);
        });
        it('should RPE', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe8);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RPE};
            expect(actual).to.eql(expected);
        });
        it('should RM', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf8);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RM};
            expect(actual).to.eql(expected);
        });
        it('should RET', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc9);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RET};
            expect(actual).to.eql(expected);
        });
        it('should RET', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd9);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.RET};
            expect(actual).to.eql(expected);
        });

    });

    describe('fetch decode jump', () => {


        beforeEach(() => {
            reset();
        });

        it('should JNZ', () => {
            const addr = highLow(0, 4);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc2);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JNZ, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JNC', () => {
            const addr = highLow(22, 10);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd2);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JNC, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JPO', () => {
            const addr = highLow(23, 34);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe2);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JPO, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JP', () => {
            const addr = highLow(87, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf2);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JP, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JZ', () => {
            const addr = highLow(33, 44);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xca);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JZ, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JC', () => {
            const addr = highLow(23, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xda);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JC, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JPE', () => {
            const addr = highLow(65, 98);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xea);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JPE, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JMP', () => {
            const addr = highLow(23, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc3);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JMP, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JMP*', () => {
            const addr = highLow(23, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xcb);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JMP, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should JM', () => {
            const addr = highLow(23, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xfa);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.JM, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should PCHL', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe9);
            memAddress = xIncrement(memAddress);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.PCHL};
            expect(actual).to.eql(expected);
        });

    });


    describe('fetch decode call', () => {


        beforeEach(() => {
            reset();
        });

        it('should CNZ', () => {
            const addr = highLow(0, 4);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xc4);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CNZ, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CNC', () => {
            const addr = highLow(22, 10);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xd4);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CNC, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CPO', () => {
            const addr = highLow(23, 34);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xe4);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CPO, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CP', () => {
            const addr = highLow(87, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xf4);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CP, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CZ', () => {
            const addr = highLow(33, 44);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xcc);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CZ, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CC', () => {
            const addr = highLow(23, 56);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xdc);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CC, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CPE', () => {
            const addr = highLow(65, 98);
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xec);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CPE, position: addr};
            expect(actual).to.eql(expected);
        });
        it('should CM', () => {
            let memAddress = toHighLow(0);
            memory.store(memAddress, 0xfc);
            const addr = highLow(23, 56);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.low);
            memAddress = xIncrement(memAddress);
            memory.store(memAddress, addr.high);
            const actual = fetchDecode.next();
            const expected: OperationT = {type: OPERATION.CM, position: addr};
            expect(actual).to.eql(expected);

        });

        it('should call', () => {
            [
                0xcd,
                0xdd,
                0xed,
                0xfd,
            ].forEach(val => {
                reset();
                let memAddress = toHighLow(0);
                memory.store(memAddress, val);
                const addr = highLow(23, 56);
                memAddress = xIncrement(memAddress);
                memory.store(memAddress, addr.low);
                memAddress = xIncrement(memAddress);
                memory.store(memAddress, addr.high);
                const actual = fetchDecode.next();
                const expected: OperationT = {type: OPERATION.CALL, position: addr};
                expect(actual).to.eql(expected);
            })

            printCX(XRMAP)
        });

    });
});
