import {Parser} from './parser';
import {Assembler, buildSymbolMap, getCode, registerSymbolMap} from './assembler';
import {OPERATION} from '../interface';


describe('Assembler test', () => {

    const parser = new Parser();
    const assembler = new Assembler(parser);


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
        expect(map).toEqual({...registerSymbolMap, MV1: 1, MV3: 3, MV2: 7, DIV0: 12});
    });

    it('should getCodeNOP', () => {
        const op = 'NOP';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x00]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));
    });
    it('should getCodeXCHG', () => {
        const op = 'XCHG';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xeb]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));
    });
    it('should getCodeXTHL', () => {
        const op = 'XTHL';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xe3]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));
    });
    it('should getCodePCHL', () => {
        const op = 'PCHL';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xe9]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));
    });
    it('should getCodeSPHL', () => {
        const op = 'SPHL';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xf9]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));
    });
    it('should getCodeHLT', () => {
        const op = 'HLT';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x76]);
        expect(() => getCode(
            {code: op, operands: [0x0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));
    });
    it('should getCodeLXI', () => {
        const op = 'LXI';
        expect(getCode(
            {code: op, operands: ['B', 0x5672]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x01, 0x72, 0x56]);
        expect(getCode(
            {code: op, operands: ['D', 0x7312]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x11, 0x12, 0x73]);
        expect(getCode(
            {code: op, operands: ['H', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x21, 0x12, 0x56]);
        expect(getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x31, 0x12, 0x56]);

        expect(() => getCode(
            {code: op, operands: ['F', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [9, 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['H', 0x15612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
    });
    it('should getCodeSTAX', () => {
        const op = 'STAX';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x02]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x12]);

        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [5]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
    });
    it('should getCodeLDAX', () => {
        const op = 'LDAX';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x0a]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x1a]);

        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [5]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
    });

    it('should getCodeSHLD', () => {
        const op = 'SHLD';
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x22, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });
    it('should getCodeLHLD', () => {
        const op = 'LHLD';
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x2a, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });
    it('should getCodeSTA', () => {
        const op = 'STA';
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x32, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [0x10000, 0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

    });
    it('should getCodeLDA', () => {
        const op = 'LDA';
        expect(getCode(
            {code: op, operands: [0x5672]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x3a, 0x72, 0x56]);

        expect(() => getCode(
            {code: op, operands: [0x10000]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [0x10000, 0]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

    });

    it('should getCodeINX', () => {
        const op = 'INX';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x03]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x13]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x23]);
        expect(getCode(
            {code: op, operands: ['SP']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x33]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
    });

    it('should getCodePOP', () => {
        const op = 'POP';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xc1]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xd1]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xe1]);
        expect(getCode(
            {code: op, operands: ['PSW']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xf1]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
    });
    it('should getCodePUSH', () => {
        const op = 'PUSH';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xc5]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xd5]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xe5]);
        expect(getCode(
            {code: op, operands: ['PSW']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xf5]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
    });

    it('should getCodeDAD', () => {
        const op = 'DAD';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x09]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x19]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x29]);
        expect(getCode(
            {code: op, operands: ['SP']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x39]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

    });
    it('should getCodeDCX', () => {
        const op = 'DCX';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x0b]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x1b]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x2b]);
        expect(getCode(
            {code: op, operands: ['SP']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x3b]);
        expect(() => getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['SP', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

    });
    it('should getCodeINR', () => {
        const op = 'INR';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x04]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x0c]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x14]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x1c]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x24]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x2c]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x34]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x3c]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['A', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

    });
    it('should getCodeDCR', () => {
        const op = 'DCR';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x05]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x0d]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x15]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x1d]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x25]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x2d]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x35]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x3d]);

        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['A', 0x5612]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

    });
    it('should getCodeMVI', () => {
        const op = 'MVI';
        expect(getCode(
            {code: op, operands: ['B', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x06, 0x56]);
        expect(getCode(
            {code: op, operands: ['C', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x0e, 0x56]);
        expect(getCode(
            {code: op, operands: ['D', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x16, 0x56]);
        expect(getCode(
            {code: op, operands: ['E', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x1e, 0x56]);
        expect(getCode(
            {code: op, operands: ['H', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x26, 0x56]);
        expect(getCode(
            {code: op, operands: ['L', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x2e, 0x56]);
        expect(getCode(
            {code: op, operands: ['M', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x36, 0x56]);
        expect(getCode(
            {code: op, operands: ['A', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x3e, 0x56]);

        expect(() => getCode(
            {code: op, operands: ['F', 0x56]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['A', 0x100]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: ['A', 34, 0x100]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 2 (3 given)'));

    });
    it('should getCodeRLC', () => {
        const op = 'RLC';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x07]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeRAL', () => {
        const op = 'RAL';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x17]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeDAA', () => {
        const op = 'DAA';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x27]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeSTC', () => {
        const op = 'STC';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x37]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeRRC', () => {
        const op = 'RRC';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x0f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeRAR', () => {
        const op = 'RAR';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x1f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeCMA', () => {
        const op = 'CMA';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x2f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeCMC', () => {
        const op = 'CMC';
        expect(getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x3f]);

        expect(() => getCode(
            {code: op, operands: ['x']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 0 (1 given)'));

    });
    it('should getCodeMOV B', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['B', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x40]);
        expect(getCode(
            {code: op, operands: ['B', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x41]);
        expect(getCode(
            {code: op, operands: ['B', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x42]);
        expect(getCode(
            {code: op, operands: ['B', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x43]);
        expect(getCode(
            {code: op, operands: ['B', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x44]);
        expect(getCode(
            {code: op, operands: ['B', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x45]);
        expect(getCode(
            {code: op, operands: ['B', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x46]);
        expect(getCode(
            {code: op, operands: ['B', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x47]);

    });

    it('should getCodeMOV C', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['C', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x48]);
        expect(getCode(
            {code: op, operands: ['C', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x49]);
        expect(getCode(
            {code: op, operands: ['C', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x4a]);
        expect(getCode(
            {code: op, operands: ['C', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x4b]);
        expect(getCode(
            {code: op, operands: ['C', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x4c]);
        expect(getCode(
            {code: op, operands: ['C', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x4d]);
        expect(getCode(
            {code: op, operands: ['C', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x4e]);
        expect(getCode(
            {code: op, operands: ['C', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x4f]);

    });
    it('should getCodeMOV D', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['D', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x50]);
        expect(getCode(
            {code: op, operands: ['D', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x51]);
        expect(getCode(
            {code: op, operands: ['D', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x52]);
        expect(getCode(
            {code: op, operands: ['D', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x53]);
        expect(getCode(
            {code: op, operands: ['D', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x54]);
        expect(getCode(
            {code: op, operands: ['D', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x55]);
        expect(getCode(
            {code: op, operands: ['D', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x56]);
        expect(getCode(
            {code: op, operands: ['D', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x57]);

    });

    it('should getCodeMOV E', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['E', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x58]);
        expect(getCode(
            {code: op, operands: ['E', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x59]);
        expect(getCode(
            {code: op, operands: ['E', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x5a]);
        expect(getCode(
            {code: op, operands: ['E', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x5b]);
        expect(getCode(
            {code: op, operands: ['E', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x5c]);
        expect(getCode(
            {code: op, operands: ['E', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x5d]);
        expect(getCode(
            {code: op, operands: ['E', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x5e]);
        expect(getCode(
            {code: op, operands: ['E', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x5f]);

    });
    it('should getCodeMOV H', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['H', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x60]);
        expect(getCode(
            {code: op, operands: ['H', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x61]);
        expect(getCode(
            {code: op, operands: ['H', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x62]);
        expect(getCode(
            {code: op, operands: ['H', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x63]);
        expect(getCode(
            {code: op, operands: ['H', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x64]);
        expect(getCode(
            {code: op, operands: ['H', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x65]);
        expect(getCode(
            {code: op, operands: ['H', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x66]);
        expect(getCode(
            {code: op, operands: ['H', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x67]);

    });

    it('should getCodeMOV E', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['L', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x68]);
        expect(getCode(
            {code: op, operands: ['L', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x69]);
        expect(getCode(
            {code: op, operands: ['L', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x6a]);
        expect(getCode(
            {code: op, operands: ['L', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x6b]);
        expect(getCode(
            {code: op, operands: ['L', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x6c]);
        expect(getCode(
            {code: op, operands: ['L', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x6d]);
        expect(getCode(
            {code: op, operands: ['L', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x6e]);
        expect(getCode(
            {code: op, operands: ['L', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x6f]);

    });
    it('should getCodeMOV M', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['M', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x70]);
        expect(getCode(
            {code: op, operands: ['M', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x71]);
        expect(getCode(
            {code: op, operands: ['M', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x72]);
        expect(getCode(
            {code: op, operands: ['M', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x73]);
        expect(getCode(
            {code: op, operands: ['M', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x74]);
        expect(getCode(
            {code: op, operands: ['M', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x75]);
        expect(getCode(
            {code: op, operands: ['M', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x77]);

    });

    it('should getCodeMOV A', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: ['A', 'B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x78]);
        expect(getCode(
            {code: op, operands: ['A', 'C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x79]);
        expect(getCode(
            {code: op, operands: ['A', 'D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x7a]);
        expect(getCode(
            {code: op, operands: ['A', 'E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x7b]);
        expect(getCode(
            {code: op, operands: ['A', 'H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x7c]);
        expect(getCode(
            {code: op, operands: ['A', 'L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x7d]);
        expect(getCode(
            {code: op, operands: ['A', 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x7e]);
        expect(getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x7f]);

    });

    it('should getCodeMOV by number', () => {
        const op = 'MOV';
        expect(getCode(
            {code: op, operands: [2, 'M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x56]);
        expect(getCode(
            {code: op, operands: ['M', 2]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x72]);
    });

    it('should getCodeMOV Invalid', () => {
        const op = 'MOV';
        expect(() => getCode(
            {code: op, operands: ['A', 'A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 2 (3 given)'));
        expect(() => getCode(
            {code: op, operands: ['A', 'F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: ['M', 'M']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid operation'));
        expect(() => getCode(
            {code: op, operands: ['M', 9]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [9, 'M']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
    });


    it('should getCodeADD', () => {
        const op = 'ADD';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x80]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x81]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x82]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x83]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x84]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x85]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x86]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x87]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });
    it('should getCodeADC', () => {
        const op = 'ADC';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x88]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x89]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x8a]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x8b]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x8c]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x8d]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x8e]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x8f]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });

    it('should getCodeSUB', () => {
        const op = 'SUB';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x90]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x91]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x92]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x93]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x94]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x95]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x96]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x97]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });
    it('should getCodeSBB', () => {
        const op = 'SBB';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x98]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x99]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x9a]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x9b]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x9c]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x9d]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x9e]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0x9f]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });

    it('should getCodeANA', () => {
        const op = 'ANA';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa0]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa1]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa2]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa3]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa4]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa5]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa6]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa7]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });
    it('should getCodeXRA', () => {
        const op = 'XRA';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa8]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xa9]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xaa]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xab]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xac]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xad]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xae]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xaf]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });

    it('should getCodeORA', () => {
        const op = 'ORA';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb0]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb1]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb2]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb3]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb4]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb5]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb6]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb7]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });
    it('should getCodeCMP', () => {
        const op = 'CMP';
        expect(getCode(
            {code: op, operands: ['B']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb8]);
        expect(getCode(
            {code: op, operands: ['C']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xb9]);
        expect(getCode(
            {code: op, operands: ['D']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xba]);
        expect(getCode(
            {code: op, operands: ['E']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xbb]);
        expect(getCode(
            {code: op, operands: ['H']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xbc]);
        expect(getCode(
            {code: op, operands: ['L']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xbd]);
        expect(getCode(
            {code: op, operands: ['M']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xbe]);
        expect(getCode(
            {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xbf]);
        expect(() => getCode(
            {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));
        expect(() => getCode(
            {code: op, operands: ['F']}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));
        expect(() => getCode(
            {code: op, operands: [8]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

    });

    describe('should return', () => {
        it('should getCodeRNZ', () => {
            const op = 'RNZ';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xc0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });

        it('should getCodeRNC', () => {
            const op = 'RNC';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xd0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });

        it('should getCodeRPO', () => {
            const op = 'RPO';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xe0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });
        it('should getCodeRP', () => {
            const op = 'RP';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xf0]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });
        it('should getCodeRZ', () => {
            const op = 'RZ';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xc8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });

        it('should getCodeRC', () => {
            const op = 'RC';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xd8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });
        it('should getCodeRPE', () => {
            const op = 'RPE';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xe8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });
        it('should getCodeRM', () => {
            const op = 'RM';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xf8]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });
        it('should getCodeRET', () => {
            const op = 'RET';
            expect(getCode(
                {code: op, operands: []}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xc9]);
            expect(() => getCode(
                {code: op, operands: ['A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 0 (1 given)'));
        });
    });

    describe('should jump', () => {
        it('should getCodeJNZ', () => {
            const op = 'JNZ';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xc2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xc2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });

        it('should getCodeJNC', () => {
            const op = 'JNC';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xd2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xd2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });

        it('should getCodeJPO', () => {
            const op = 'JPO';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xe2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xe2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeJP', () => {
            const op = 'JP';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xf2, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xf2, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeJZ', () => {
            const op = 'JZ';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xca, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xca, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });

        it('should getCodeJC', () => {
            const op = 'JC';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xda, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xda, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeJPE', () => {
            const op = 'JPE';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xea, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xea, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeJM', () => {
            const op = 'JM';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xfa, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xfa, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeJMP', () => {
            const op = 'JMP';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xc3, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xc3, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
    });

    describe('should call', () => {
        it('should getCodeCNZ', () => {
            const op = 'CNZ';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xc4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xc4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });

        it('should getCodeCNC', () => {
            const op = 'CNC';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xd4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xd4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });

        it('should getCodeCPO', () => {
            const op = 'CPO';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xe4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xe4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeCP', () => {
            const op = 'CP';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xf4, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xf4, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['A', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeCZ', () => {
            const op = 'CZ';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xcc, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xcc, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });

        it('should getCodeCC', () => {
            const op = 'CC';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xdc, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xdc, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeCPE', () => {
            const op = 'CPE';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xec, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xec, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeCM', () => {
            const op = 'CM';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xfc, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xfc, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
        it('should getCodeCALL', () => {
            const op = 'CALL';
            expect(getCode(
                {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
            ).toEqual([0xcd, 0x34, 0x12]);
            expect(getCode(
                {code: op, operands: ['JUMP']}, {...registerSymbolMap, REG: 1, JUMP: 0x1234})
            ).toEqual([0xcd, 0x34, 0x12]);
            expect(() => getCode(
                {code: op, operands: ['JUMP', 'A']}, {...registerSymbolMap, REG: 1})
            ).toThrowError(('operand count not 1 (2 given)'));
        });
    });

    it('should getCodeADI', () => {
        const op = 'ADI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xc6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });
    it('should getCodeACI', () => {
        const op = 'ACI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xce, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });


    it('should getCodeSUI', () => {
        const op = 'SUI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xd6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });
    it('should getCodeSBI', () => {
        const op = 'SBI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xde, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });

    it('should getCodeANI', () => {
        const op = 'ANI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xe6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });
    it('should getCodeXRI', () => {
        const op = 'XRI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xee, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });


    it('should getCodeORI', () => {
        const op = 'ORI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xf6, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
    });
    it('should getCodeCPI', () => {
        const op = 'CPI';
        expect(getCode(
            {code: op, operands: [0x12]}, {...registerSymbolMap, REG: 1})
        ).toEqual([0xfe, 0x12]);
        expect(() => getCode(
            {code: op, operands: [0x1234]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('invalid value'));

        expect(() => getCode(
            {code: op, operands: [0x12, 0x12]}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (2 given)'));

        expect(() => getCode(
            {code: op, operands: []}, {...registerSymbolMap, REG: 1})
        ).toThrowError(('operand count not 1 (0 given)'));
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
        `);
        expect(assembled).toEqual([0x1f, 0x3e, 0x01, 0x06, 0x02, 0x0e, 0x17, 0x16, 0x04, 0x1e, 0x05]);
    });
    it('should assemble hl label', () => {
        const assembled = assembler.assemble(
            `LXI H, Label
Label:
    HLT
`);
        expect(assembled).toEqual([0x21, 0x03, 0x00, 0x76]);
    });
    it('should assemble fib', () => {
        const assembled = assembler.assembleMap(
            `MVI A,1
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
`
        );

        const program: Array<[number, number]> = [
            [0x3e, 1], [0x01, 1],                   // a = 1
            [0x06, 2], [0x01, 2],                   // b = 1
            [0x16, 3], [0x05, 3],                   // d = 5

            // LOOP:
            [0x4f, 6],                              // c = a
            [0x80, 7],                              // a += b
            [0x41, 8],                              // b = c

            [0x15, 9],                              // d--;
            [0xc2, 10], [0x06, 10], [0x00, 10],        // if !0 -> jump LOOP

            [0xf5, 12],                             // push PSW;
            [0x76, 13],                             // halt
        ];
        expect(assembled).toEqual(program);
    });
});
