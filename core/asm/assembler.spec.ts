import {Parser} from "./parser";
import {Assembler, buildSymbolMap, getCode, registerSymbolMap} from "./assembler";
import {expect} from 'chai';
import {OPERATION} from "../interface/operation/operation.types";

const child_process = require('child_process');


describe('Assembler test', () => {

    const parser = new Parser();
    const assembler = new Assembler(parser);

    before(() => {
        child_process.execSync('npm run build:parser')
    });

    it('should build symbol map', () => {

        const map = buildSymbolMap(parser.parse(`
        RAR
        MV1: MVI   a, 1
        MV3: MVI   b, 2
               MVI   c
        MV2: MVI d,   4   ; foo bar%
         ; foo bar% !?$§&|<<>>[](){}
        JNZ MV3
         
         
        DIV0: MVI   e, 5, 64H
        `));
        expect(map).to.eql({...registerSymbolMap, MV1: 1, MV3: 3, MV2: 7, DIV0: 12})
    });

    it('should getCodeNOP', () => {
        const op = OPERATION.NOP;
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x00]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)');
    });
    it('should getCodeXCHG', () => {
        const op = OPERATION.XCHG;
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xeb]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)');
    });
    it('should getCodeXTHL', () => {
        const op = OPERATION.XTHL;
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xe3]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)');
    });
    it('should getCodePCHL', () => {
        const op = OPERATION.PCHL;
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xe9]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)');
    });
    it('should getCodeSPHL', () => {
        const op = OPERATION.SPHL;
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xf9]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)');
    });
    it('should getCodeHLT', () => {
        const op = OPERATION.HLT;
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x76]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)');
    });
    it('should getCodeLXI', () => {
        const op = OPERATION.LXI;
        expect(getCode(
            {code: op, operands: ['B', 0x5672]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x01, 0x72, 0x56]);
        expect(getCode(
            {code: op, operands: ['D', 0x7312]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x11, 0x12, 0x73]);
        expect(getCode(
            {code: op, operands: ['H', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x21, 0x12, 0x56]);
        expect(getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x31, 0x12, 0x56]);

        expect(() => getCode(
            {code: op, operands: ['F', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [9, 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value')

        expect(() => getCode(
            {code: op, operands: ['H', 0x15612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
    });
    it('should getCodeSTAX', () => {
        const op = OPERATION.STAX
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x02]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x12]);

        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [5]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value')
    });
    it('should getCodeLDAX', () => {
        const op = OPERATION.LDAX
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x0a]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x1a]);

        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [5]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value')
    });

    it('should getCodeSHLD', () => {
        const op = OPERATION.SHLD
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x22, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });
    it('should getCodeLHLD', () => {
        const op = OPERATION.LHLD
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x2a, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });
    it('should getCodeSTA', () => {
        const op = OPERATION.STA
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x32, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [0x10000, 0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

    });
    it('should getCodeLDA', () => {
        const op = OPERATION.LDA
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x3a, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [0x10000, 0]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

    });

    it('should getCodeINX', () => {
        const op = OPERATION.INX
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x03]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x13]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x23]);
        expect(getCode(
            {code: op, operands: ['SP']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x33]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')
    });

    it('should getCodePOP', () => {
        const op = OPERATION.POP
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xc1]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xd1]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xe1]);
        expect(getCode(
            {code: op, operands: ['PSW']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xf1]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')
    });
    it('should getCodePUSH', () => {
        const op = OPERATION.PUSH
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xc5]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xd5]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xe5]);
        expect(getCode(
            {code: op, operands: ['PSW']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xf5]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')
    });

    it('should getCodeDAD', () => {
        const op = OPERATION.DAD
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x09]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x19]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x29]);
        expect(getCode(
            {code: op, operands: ['SP']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x39]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')

    });
    it('should getCodeDCX', () => {
        const op = OPERATION.DCX
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x0b]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x1b]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x2b]);
        expect(getCode(
            {code: op, operands: ['SP']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x3b]);
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')

    });
    it('should getCodeINR', () => {
        const op = OPERATION.INR
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x04]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x0c]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x14]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x1c]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x24]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x2c]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x34]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x3c]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['A', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')

    });
    it('should getCodeDCR', () => {
        const op = OPERATION.DCR
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x05]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x0d]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x15]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x1d]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x25]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x2d]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x35]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x3d]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['A', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)')

    });
    it('should getCodeMVI', () => {
        const op = OPERATION.MVI
        expect(getCode(
            {code: op, operands: ['B', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x06, 0x56]);
        expect(getCode(
            {code: op, operands: ['C', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x0e, 0x56]);
        expect(getCode(
            {code: op, operands: ['D', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x16, 0x56]);
        expect(getCode(
            {code: op, operands: ['E', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x1e, 0x56]);
        expect(getCode(
            {code: op, operands: ['H', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x26, 0x56]);
        expect(getCode(
            {code: op, operands: ['L', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x2e, 0x56]);
        expect(getCode(
            {code: op, operands: ['M', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x36, 0x56]);
        expect(getCode(
            {code: op, operands: ['A', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x3e, 0x56]);

        expect(() => getCode(
            {code: op, operands: ['F', 0x56]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['A', 0x100]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: ['A', 34, 0x100]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 2 (3 given)')

    });
    it('should getCodeRLC', () => {
        const op = OPERATION.RLC
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x07]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeRAL', () => {
        const op = OPERATION.RAL
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x17]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeDAA', () => {
        const op = OPERATION.DAA
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x27]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeSTC', () => {
        const op = OPERATION.STC
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x37]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeRRC', () => {
        const op = OPERATION.RRC
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x0f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeRAR', () => {
        const op = OPERATION.RAR
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x1f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeCMA', () => {
        const op = OPERATION.CMA
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x2f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeCMC', () => {
        const op = OPERATION.CMC
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x3f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 0 (1 given)')

    });
    it('should getCodeMOV B', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['B', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x40]);
        expect(getCode(
            {code: op, operands: ['B', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x41]);
        expect(getCode(
            {code: op, operands: ['B', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x42]);
        expect(getCode(
            {code: op, operands: ['B', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x43]);
        expect(getCode(
            {code: op, operands: ['B', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x44]);
        expect(getCode(
            {code: op, operands: ['B', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x45]);
        expect(getCode(
            {code: op, operands: ['B', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x46]);
        expect(getCode(
            {code: op, operands: ['B', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x47]);

    });

    it('should getCodeMOV C', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['C', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x48]);
        expect(getCode(
            {code: op, operands: ['C', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x49]);
        expect(getCode(
            {code: op, operands: ['C', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x4a]);
        expect(getCode(
            {code: op, operands: ['C', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x4b]);
        expect(getCode(
            {code: op, operands: ['C', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x4c]);
        expect(getCode(
            {code: op, operands: ['C', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x4d]);
        expect(getCode(
            {code: op, operands: ['C', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x4e]);
        expect(getCode(
            {code: op, operands: ['C', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x4f]);

    });
    it('should getCodeMOV D', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['D', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x50]);
        expect(getCode(
            {code: op, operands: ['D', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x51]);
        expect(getCode(
            {code: op, operands: ['D', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x52]);
        expect(getCode(
            {code: op, operands: ['D', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x53]);
        expect(getCode(
            {code: op, operands: ['D', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x54]);
        expect(getCode(
            {code: op, operands: ['D', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x55]);
        expect(getCode(
            {code: op, operands: ['D', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x56]);
        expect(getCode(
            {code: op, operands: ['D', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x57]);

    });

    it('should getCodeMOV E', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['E', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x58]);
        expect(getCode(
            {code: op, operands: ['E', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x59]);
        expect(getCode(
            {code: op, operands: ['E', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x5a]);
        expect(getCode(
            {code: op, operands: ['E', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x5b]);
        expect(getCode(
            {code: op, operands: ['E', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x5c]);
        expect(getCode(
            {code: op, operands: ['E', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x5d]);
        expect(getCode(
            {code: op, operands: ['E', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x5e]);
        expect(getCode(
            {code: op, operands: ['E', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x5f]);

    });
    it('should getCodeMOV H', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['H', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x60]);
        expect(getCode(
            {code: op, operands: ['H', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x61]);
        expect(getCode(
            {code: op, operands: ['H', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x62]);
        expect(getCode(
            {code: op, operands: ['H', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x63]);
        expect(getCode(
            {code: op, operands: ['H', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x64]);
        expect(getCode(
            {code: op, operands: ['H', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x65]);
        expect(getCode(
            {code: op, operands: ['H', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x66]);
        expect(getCode(
            {code: op, operands: ['H', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x67]);

    });

    it('should getCodeMOV E', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['L', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x68]);
        expect(getCode(
            {code: op, operands: ['L', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x69]);
        expect(getCode(
            {code: op, operands: ['L', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x6a]);
        expect(getCode(
            {code: op, operands: ['L', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x6b]);
        expect(getCode(
            {code: op, operands: ['L', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x6c]);
        expect(getCode(
            {code: op, operands: ['L', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x6d]);
        expect(getCode(
            {code: op, operands: ['L', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x6e]);
        expect(getCode(
            {code: op, operands: ['L', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x6f]);

    });
    it('should getCodeMOV M', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['M', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x70]);
        expect(getCode(
            {code: op, operands: ['M', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x71]);
        expect(getCode(
            {code: op, operands: ['M', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x72]);
        expect(getCode(
            {code: op, operands: ['M', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x73]);
        expect(getCode(
            {code: op, operands: ['M', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x74]);
        expect(getCode(
            {code: op, operands: ['M', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x75]);
        expect(getCode(
            {code: op, operands: ['M', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x77]);

    });

    it('should getCodeMOV A', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: ['A', 'B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x78]);
        expect(getCode(
            {code: op, operands: ['A', 'C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x79]);
        expect(getCode(
            {code: op, operands: ['A', 'D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x7a]);
        expect(getCode(
            {code: op, operands: ['A', 'E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x7b]);
        expect(getCode(
            {code: op, operands: ['A', 'H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x7c]);
        expect(getCode(
            {code: op, operands: ['A', 'L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x7d]);
        expect(getCode(
            {code: op, operands: ['A', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x7e]);
        expect(getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x7f]);

    });

    it('should getCodeMOV by number', () => {
        const op = OPERATION.MOV
        expect(getCode(
            {code: op, operands: [2, 'M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x56]);
        expect(getCode(
            {code: op, operands: ['M', 2]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x72]);
    });

    it('should getCodeMOV Invalid', () => {
        const op = OPERATION.MOV
        expect(() => getCode(
            {code: op, operands: ['A', 'A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 2 (3 given)');
        expect(() => getCode(
            {code: op, operands: ['A', 'F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: ['M', 'M']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid operation');
        expect(() => getCode(
            {code: op, operands: ['M', 9]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [9, 'M']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
    });


    it('should getCodeADD', () => {
        const op = OPERATION.ADD
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x80]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x81]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x82]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x83]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x84]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x85]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x86]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x87]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });
    it('should getCodeADC', () => {
        const op = OPERATION.ADC
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x88]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x89]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x8a]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x8b]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x8c]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x8d]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x8e]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x8f]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });

    it('should getCodeSUB', () => {
        const op = OPERATION.SUB
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x90]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x91]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x92]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x93]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x94]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x95]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x96]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x97]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });
    it('should getCodeSBB', () => {
        const op = OPERATION.SBB
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x98]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x99]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x9a]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x9b]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x9c]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x9d]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x9e]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0x9f]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });

    it('should getCodeANA', () => {
        const op = OPERATION.ANA
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa0]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa1]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa2]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa3]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa4]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa5]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa6]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa7]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });
    it('should getCodeXRA', () => {
        const op = OPERATION.XRA
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa8]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xa9]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xaa]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xab]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xac]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xad]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xae]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xaf]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });

    it('should getCodeORA', () => {
        const op = OPERATION.ORA
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb0]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb1]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb2]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb3]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb4]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb5]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb6]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb7]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });
    it('should getCodeCMP', () => {
        const op = OPERATION.CMP
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb8]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xb9]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xba]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xbb]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xbc]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xbd]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xbe]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xbf]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

    });

    describe('should return', () => {
        it('should getCodeRNZ', () => {
            const op = OPERATION.RNZ
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xc0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });

        it('should getCodeRNC', () => {
            const op = OPERATION.RNC
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xd0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });

        it('should getCodeRPO', () => {
            const op = OPERATION.RPO
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xe0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });
        it('should getCodeRP', () => {
            const op = OPERATION.RP
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xf0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });
        it('should getCodeRZ', () => {
            const op = OPERATION.RZ
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xc8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });

        it('should getCodeRC', () => {
            const op = OPERATION.RC
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xd8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });
        it('should getCodeRPE', () => {
            const op = OPERATION.RPE
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xe8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });
        it('should getCodeRM', () => {
            const op = OPERATION.RM
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xf8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });
        it('should getCodeRET', () => {
            const op = OPERATION.RET
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xc9]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 0 (1 given)');
        });
    });

    describe('should jump', () => {
        it('should getCodeJNZ', () => {
            const op = OPERATION.JNZ
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xc2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xc2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });

        it('should getCodeJNC', () => {
            const op = OPERATION.JNC
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xd2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xd2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });

        it('should getCodeJPO', () => {
            const op = OPERATION.JPO
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xe2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xe2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeJP', () => {
            const op = OPERATION.JP
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xf2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xf2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeJZ', () => {
            const op = OPERATION.JZ
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xca, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xca, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });

        it('should getCodeJC', () => {
            const op = OPERATION.JC
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xda, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xda, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeJPE', () => {
            const op = OPERATION.JPE
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xea, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xea, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeJM', () => {
            const op = OPERATION.JM
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xfa, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xfa, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeJMP', () => {
            const op = OPERATION.JMP
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xc3, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xc3, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
    });

    describe('should call', () => {
        it('should getCodeCNZ', () => {
            const op = OPERATION.CNZ
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xc4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xc4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });

        it('should getCodeCNC', () => {
            const op = OPERATION.CNC
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xd4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xd4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });

        it('should getCodeCPO', () => {
            const op = OPERATION.CPO
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xe4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xe4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeCP', () => {
            const op = OPERATION.CP
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xf4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xf4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeCZ', () => {
            const op = OPERATION.CZ
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xcc, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xcc, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });

        it('should getCodeCC', () => {
            const op = OPERATION.CC
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xdc, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xdc, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeCPE', () => {
            const op = OPERATION.CPE
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xec, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xec, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeCM', () => {
            const op = OPERATION.CM
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xfc, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xfc, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
        it('should getCodeCALL', () => {
            const op = OPERATION.CALL
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).to.eql([0xcd, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).to.eql([0xcd, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).to.throw('operand count not 1 (2 given)');
        });
    });

    it('should getCodeADI', () => {
        const op = OPERATION.ADI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xc6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });
    it('should getCodeACI', () => {
        const op = OPERATION.ACI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xce, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });


    it('should getCodeSUI', () => {
        const op = OPERATION.SUI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xd6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });
    it('should getCodeSBI', () => {
        const op = OPERATION.SBI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xde, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });

    it('should getCodeANI', () => {
        const op = OPERATION.ANI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xe6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });
    it('should getCodeXRI', () => {
        const op = OPERATION.XRI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xee, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });


    it('should getCodeORI', () => {
        const op = OPERATION.ORI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xf6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });
    it('should getCodeCPI', () => {
        const op = OPERATION.CPI
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).to.eql([0xfe, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).to.throw('invalid value');

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (2 given)');

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).to.throw('operand count not 1 (0 given)');
    });

    it('should assemble', () => {
        const assembled = assembler.assemble(`
        RAR
        MV1: MVI    A, 1
        MV3: MVI    B, 2
             MVI    C, 23
        MV2: MVI    D,   4   ; foo bar%
         ; foo bar% !?$§&|<<>>[](){}
         
        
        
         
        DIV0: MVI   E, 5
        `)
        expect(assembled).to.eql([0x1f, 0x3e, 0x01, 0x06, 0x02, 0x0e, 0x17, 0x16, 0x04, 0x1e, 0x05])
    })
    it('should assemble fib', () => {
        const assembled = assembler.assemble(`
            MVI A,1
            MVI B,1
            MVI D,5
                     
            LOOP:  
            MOV C,A
            ADD B 
            MOV B,C
            DCR D
            JNZ LOOP
            
            PUSH PSW
            HLT
           
        `)

        const program = [
            0x3e, 0x01,         // a = 1
            0x06, 0x01,         // b = 1
            0x16, 0x05,         // d = 5

            // LOOP:
            0x4f,               // c = a
            0x80,               // a += b
            0x41,               // b = c

            0x15,               // d--;
            0xc2, 0x06, 0x00,   // if !0 -> jump LOOP

            0xf5,               // push PSW;
            0x76,               // halt
        ];
        expect(assembled).to.eql(program)
    })
});
