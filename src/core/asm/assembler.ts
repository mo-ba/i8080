import {Parser} from './parser';
import {AsmOperand, AsmOperation, Lines, SymbolMap} from './interface';
import {OPERATION} from '../interface';
import {toHighLow} from '../util';

export const registerSymbolMap = {
    B: 0,
    C: 1,
    D: 2,
    E: 3,
    H: 4,
    L: 5,
    M: 6, SP: 6, PSW: 6,
    A: 7,
};

export function buildSymbolMap(lines: Lines) {
    function getSize(code: string | number): number {

        const size: { [code: string]: number } = {
                ['XRI']: 2, ['ORI']: 2, ['SUI']: 2, ['JM']: 3, ['ANI']: 2,
                ['MVI']: 2, ['ADI']: 2, ['ACI']: 2, ['CPI']: 2, ['SBI']: 2,
                ['LXI']: 3, ['JP']: 3, ['SHLD']: 3, ['LHLD']: 3, ['STA']: 3,
                ['LDA']: 3, ['JNZ']: 3, ['JMP']: 3, ['CNZ']: 3, ['CP']: 3,
                ['JZ']: 3, ['CZ']: 3, ['CALL']: 3, ['JNC']: 3, ['CPE']: 3,
                ['CNC']: 3, ['JC']: 3, ['CC']: 3, ['JPE']: 3, ['CPO']: 3,
                ['JPO']: 3, ['CM']: 3,
            }
        ;
        return size[code] || 1;
    }

    const symbolMap: SymbolMap = {
        ...registerSymbolMap
    };
    let instructionCount = 0;

    for (const line of lines) {
        if (line.label) {
            symbolMap[line.label] = instructionCount;
        }
        if (line.operation) {
            const size = getSize(line.operation.code);
            instructionCount += size;
        }
    }
    return symbolMap;
}

export function getCode(operation: AsmOperation, symbolMap: SymbolMap): number[] {

    const operands = operation.operands || [];


    function assertOperandCount(count: number) {
        if (operands.length !== count) {
            throw new Error('operand count not ' + count + ' (' + operands.length + ' given)');
        }
        return operands;
    }

    function assertNumericValue(value: AsmOperand): number {
        if (typeof value !== 'number') {
            throw new Error('invalid value');

        }
        return +value;
    }

    function assertValueBetween(value: number, lowerBound: number, upperBound: number): number {
        if (value < lowerBound || value > upperBound) {
            throw new Error('invalid value');
        }
        return value;
    }

    function resolveSymbol(operand: AsmOperand): AsmOperand {
        const value = symbolMap[operand];
        if (value !== undefined) {
            return resolveSymbol(value);
        }
        return operand;
    }

    function getRegisterPair(operand: AsmOperand) {
        const symbol = resolveSymbol(operand);
        if (+symbol & 1) {
            throw new Error('invalid value');
        }
        return assertNumericValue(symbol) >> 1;
    }

    function getRegister(operand: AsmOperand) {
        return assertValueBetween(assertNumericValue(resolveSymbol(operand)), 0, 7);
    }

    function lowHigh(num: number): number[] {
        assertValueBetween(num, 0, 0xffff);
        const hl = toHighLow(num);
        return [hl.low, hl.high];
    }

    function toValue(num: number): number {
        return assertValueBetween(num, 0, 0xff);
    }

    function getCodeSingleValue(value: number): number[] {
        if (!operands) {
            return [value];
        }
        assertOperandCount(0);
        return [value];
    }

    function getCodeRegisterOperation(code: number): number[] {
        assertOperandCount(1);
        const reg = getRegister(operands[0]);
        return [code + (reg << 3)];

    }

    function getCodeRegisterPairOperation(code: number): number[] {
        assertOperandCount(1);
        const reg = assertValueBetween(getRegisterPair(operands[0]), 0, 3);
        return [code + (reg << 4)];

    }

    function getCodeHalfRegisterPairOperation(code: number): number[] {
        assertOperandCount(1);
        const reg = assertValueBetween(getRegisterPair(operands[0]), 0, 1);
        return [code + (reg << 4)];

    }

    function getCodeImmediateWord(code: number): number[] {
        assertOperandCount(1);
        return [code, ...lowHigh(assertNumericValue(resolveSymbol(operands[0])))];
    }

    function getCodeImmediateByte(code: number): number[] {
        assertOperandCount(1);
        return [code, toValue(assertNumericValue(resolveSymbol(operands[0])))];
    }


    function getCodeLXI(): number[] {
        assertOperandCount(2);
        const reg = assertValueBetween(getRegisterPair(operands[0]), 0, 3);
        return [0x01 + (reg << 4), ...lowHigh(assertNumericValue(resolveSymbol(operands[1])))];
    }

    function getCodePOP(): number[] {
        return getCodeRegisterPairOperation(0xc1);
    }

    function getCodePUSH(): number[] {
        return getCodeRegisterPairOperation(0xc5);
    }


    function getCodeMVI(): number[] {
        assertOperandCount(2);
        const reg = getRegister(operands[0]);
        return [0x06 + (reg << 3), assertValueBetween(assertNumericValue(operands[1]), 0, 0xff)];
    }


    function getCodeMOV(): number[] {
        assertOperandCount(2);
        const reg0 = getRegister(operands[0]);
        const reg1 = getRegister(operands[1]);
        if (reg0 === 6 && reg1 === 6) {
            throw new Error('invalid operation');
        }
        return [0x40 + reg1 + (reg0 << 3)];
    }

    function getCodeAluA(code: number): number[] {
        assertOperandCount(1);
        const reg = getRegister(operands[0]);
        return [code + reg];
    }


    switch (operation.code) {
        case 'NOP':
            return getCodeSingleValue(0x00);
        case 'LXI':
            return getCodeLXI();

        case 'STAX':
            return getCodeHalfRegisterPairOperation(0x02);
        case 'LDAX':
            return getCodeHalfRegisterPairOperation(0x0a);
        case 'SHLD':
            return getCodeImmediateWord(0x22);
        case 'LHLD':
            return getCodeImmediateWord(0x2a);
        case 'STA':
            return getCodeImmediateWord(0x32);
        case 'LDA':
            return getCodeImmediateWord(0x3a);

        case 'INX':
            return getCodeRegisterPairOperation(0x03);
        case 'DAD':
            return getCodeRegisterPairOperation(0x09);
        case 'DCX':
            return getCodeRegisterPairOperation(0x0b);

        case 'INR':
            return getCodeRegisterOperation(0x04);
        case 'DCR':
            return getCodeRegisterOperation(0x05);

        case 'RLC':
            return getCodeSingleValue(0x07);
        case 'RAL':
            return getCodeSingleValue(0x17);
        case 'DAA':
            return getCodeSingleValue(0x27);
        case 'STC':
            return getCodeSingleValue(0x37);
        case 'RRC':
            return getCodeSingleValue(0x0f);
        case 'RAR':
            return getCodeSingleValue(0x1f);
        case 'CMA':
            return getCodeSingleValue(0x2f);
        case 'CMC':
            return getCodeSingleValue(0x3f);


        case 'MVI':
            return getCodeMVI();
        case 'MOV':
            return getCodeMOV();
        case 'HLT':
            return getCodeSingleValue(0x76);

        case 'ADD':
            return getCodeAluA(0x80);
        case 'ADC':
            return getCodeAluA(0x88);
        case 'SUB':
            return getCodeAluA(0x90);
        case 'SBB':
            return getCodeAluA(0x98);
        case 'ANA':
            return getCodeAluA(0xa0);
        case 'XRA':
            return getCodeAluA(0xa8);
        case 'ORA':
            return getCodeAluA(0xb0);
        case 'CMP':
            return getCodeAluA(0xb8);

        case 'ADI':
            return getCodeImmediateByte(0xc6);
        case 'SUI':
            return getCodeImmediateByte(0xd6);
        case 'ANI':
            return getCodeImmediateByte(0xe6);
        case 'ORI':
            return getCodeImmediateByte(0xf6);
        case 'ACI':
            return getCodeImmediateByte(0xce);
        case 'SBI':
            return getCodeImmediateByte(0xde);
        case 'XRI':
            return getCodeImmediateByte(0xee);
        case 'CPI':
            return getCodeImmediateByte(0xfe);

        case 'PUSH':
            return getCodePUSH();
        case 'POP':
            return getCodePOP();

        case 'RNZ':
            return getCodeSingleValue(0xc0);
        case 'RNC':
            return getCodeSingleValue(0xd0);
        case 'RPO':
            return getCodeSingleValue(0xe0);
        case 'RP':
            return getCodeSingleValue(0xf0);
        case 'RZ':
            return getCodeSingleValue(0xc8);
        case 'RC':
            return getCodeSingleValue(0xd8);
        case 'RPE':
            return getCodeSingleValue(0xe8);
        case 'RM':
            return getCodeSingleValue(0xf8);
        case 'RET':
            return getCodeSingleValue(0xc9);

        case 'JNZ':
            return getCodeImmediateWord(0xc2);
        case 'JNC':
            return getCodeImmediateWord(0xd2);
        case 'JPO':
            return getCodeImmediateWord(0xe2);
        case 'JP':
            return getCodeImmediateWord(0xf2);
        case 'JZ':
            return getCodeImmediateWord(0xca);
        case 'JC':
            return getCodeImmediateWord(0xda);
        case 'JPE':
            return getCodeImmediateWord(0xea);
        case 'JM':
            return getCodeImmediateWord(0xfa);
        case 'JMP':
            return getCodeImmediateWord(0xc3);


        case 'CNZ':
            return getCodeImmediateWord(0xc4);
        case 'CNC':
            return getCodeImmediateWord(0xd4);
        case 'CPO':
            return getCodeImmediateWord(0xe4);
        case 'CP':
            return getCodeImmediateWord(0xf4);
        case 'CZ':
            return getCodeImmediateWord(0xcc);
        case 'CC':
            return getCodeImmediateWord(0xdc);
        case 'CPE':
            return getCodeImmediateWord(0xec);
        case 'CM':
            return getCodeImmediateWord(0xfc);
        case 'CALL':
            return getCodeImmediateWord(0xcd);

        case 'PCHL':
            return getCodeSingleValue(0xe9);
        case 'SPHL':
            return getCodeSingleValue(0xf9);
        case 'XCHG':
            return getCodeSingleValue(0xeb);
        case 'XTHL':
            return getCodeSingleValue(0xe3);


    }


}

export class Assembler {


    constructor(private parser: Parser) {
    }

    public assemble(src: string): number[] {
        return this.assembleMap(src).map(e => e[0]);
    }

    public assembleMap(src: string): Array<[number, number]> {
        const lines = this.parser.parse(src);
        const symbolMap = buildSymbolMap(lines);
        console.log({symbolMap});
        const code: Array<[number, number]> = [];
        for (const line of lines) {
            if (line.operation) {
                const codes: Array<[number, number]> = getCode(line.operation, symbolMap).map(n => [n, line.location.start.line]);
                code.push(...codes);
            }
        }
        return code;
    }
}
