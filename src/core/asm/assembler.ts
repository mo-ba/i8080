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
    function getSize(code: string): number {

        const size: { [code: string]: number } = {
                [OPERATION.XRI]: 2, [OPERATION.ORI]: 2, [OPERATION.SUI]: 2, [OPERATION.JM]: 3, [OPERATION.ANI]: 2,
                [OPERATION.MVI]: 2, [OPERATION.ADI]: 2, [OPERATION.ACI]: 2, [OPERATION.CPI]: 2, [OPERATION.SBI]: 2,
                [OPERATION.LXI]: 3, [OPERATION.JP]: 3, [OPERATION.SHLD]: 3, [OPERATION.LHLD]: 3, [OPERATION.STA]: 3,
                [OPERATION.LDA]: 3, [OPERATION.JNZ]: 3, [OPERATION.JMP]: 3, [OPERATION.CNZ]: 3, [OPERATION.CP]: 3,
                [OPERATION.JZ]: 3, [OPERATION.CZ]: 3, [OPERATION.CALL]: 3, [OPERATION.JNC]: 3, [OPERATION.CPE]: 3,
                [OPERATION.CNC]: 3, [OPERATION.JC]: 3, [OPERATION.CC]: 3, [OPERATION.JPE]: 3, [OPERATION.CPO]: 3,
                [OPERATION.JPO]: 3, [OPERATION.CM]: 3,
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
        case OPERATION.NOP:
            return getCodeSingleValue(0x00);
        case OPERATION.LXI:
            return getCodeLXI();

        case OPERATION.STAX:
            return getCodeHalfRegisterPairOperation(0x02);
        case OPERATION.LDAX:
            return getCodeHalfRegisterPairOperation(0x0a);
        case OPERATION.SHLD:
            return getCodeImmediateWord(0x22);
        case OPERATION.LHLD:
            return getCodeImmediateWord(0x2a);
        case OPERATION.STA:
            return getCodeImmediateWord(0x32);
        case OPERATION.LDA:
            return getCodeImmediateWord(0x3a);

        case OPERATION.INX:
            return getCodeRegisterPairOperation(0x03);
        case OPERATION.DAD:
            return getCodeRegisterPairOperation(0x09);
        case OPERATION.DCX:
            return getCodeRegisterPairOperation(0x0b);

        case OPERATION.INR:
            return getCodeRegisterOperation(0x04);
        case OPERATION.DCR:
            return getCodeRegisterOperation(0x05);

        case OPERATION.RLC:
            return getCodeSingleValue(0x07);
        case OPERATION.RAL:
            return getCodeSingleValue(0x17);
        case OPERATION.DAA:
            return getCodeSingleValue(0x27);
        case OPERATION.STC:
            return getCodeSingleValue(0x37);
        case OPERATION.RRC:
            return getCodeSingleValue(0x0f);
        case OPERATION.RAR:
            return getCodeSingleValue(0x1f);
        case OPERATION.CMA:
            return getCodeSingleValue(0x2f);
        case OPERATION.CMC:
            return getCodeSingleValue(0x3f);


        case OPERATION.MVI:
            return getCodeMVI();
        case OPERATION.MOV:
            return getCodeMOV();
        case OPERATION.HLT:
            return getCodeSingleValue(0x76);

        case OPERATION.ADD:
            return getCodeAluA(0x80);
        case OPERATION.ADC:
            return getCodeAluA(0x88);
        case OPERATION.SUB:
            return getCodeAluA(0x90);
        case OPERATION.SBB:
            return getCodeAluA(0x98);
        case OPERATION.ANA:
            return getCodeAluA(0xa0);
        case OPERATION.XRA:
            return getCodeAluA(0xa8);
        case OPERATION.ORA:
            return getCodeAluA(0xb0);
        case OPERATION.CMP:
            return getCodeAluA(0xb8);

        case OPERATION.ADI:
            return getCodeImmediateByte(0xc6);
        case OPERATION.SUI:
            return getCodeImmediateByte(0xd6);
        case OPERATION.ANI:
            return getCodeImmediateByte(0xe6);
        case OPERATION.ORI:
            return getCodeImmediateByte(0xf6);
        case OPERATION.ACI:
            return getCodeImmediateByte(0xce);
        case OPERATION.SBI:
            return getCodeImmediateByte(0xde);
        case OPERATION.XRI:
            return getCodeImmediateByte(0xee);
        case OPERATION.CPI:
            return getCodeImmediateByte(0xfe);

        case OPERATION.PUSH:
            return getCodePUSH();
        case OPERATION.POP:
            return getCodePOP();

        case OPERATION.RNZ:
            return getCodeSingleValue(0xc0);
        case OPERATION.RNC:
            return getCodeSingleValue(0xd0);
        case OPERATION.RPO:
            return getCodeSingleValue(0xe0);
        case OPERATION.RP:
            return getCodeSingleValue(0xf0);
        case OPERATION.RZ:
            return getCodeSingleValue(0xc8);
        case OPERATION.RC:
            return getCodeSingleValue(0xd8);
        case OPERATION.RPE:
            return getCodeSingleValue(0xe8);
        case OPERATION.RM:
            return getCodeSingleValue(0xf8);
        case OPERATION.RET:
            return getCodeSingleValue(0xc9);

        case OPERATION.JNZ:
            return getCodeImmediateWord(0xc2);
        case OPERATION.JNC:
            return getCodeImmediateWord(0xd2);
        case OPERATION.JPO:
            return getCodeImmediateWord(0xe2);
        case OPERATION.JP:
            return getCodeImmediateWord(0xf2);
        case OPERATION.JZ:
            return getCodeImmediateWord(0xca);
        case OPERATION.JC:
            return getCodeImmediateWord(0xda);
        case OPERATION.JPE:
            return getCodeImmediateWord(0xea);
        case OPERATION.JM:
            return getCodeImmediateWord(0xfa);
        case OPERATION.JMP:
            return getCodeImmediateWord(0xc3);


        case OPERATION.CNZ:
            return getCodeImmediateWord(0xc4);
        case OPERATION.CNC:
            return getCodeImmediateWord(0xd4);
        case OPERATION.CPO:
            return getCodeImmediateWord(0xe4);
        case OPERATION.CP:
            return getCodeImmediateWord(0xf4);
        case OPERATION.CZ:
            return getCodeImmediateWord(0xcc);
        case OPERATION.CC:
            return getCodeImmediateWord(0xdc);
        case OPERATION.CPE:
            return getCodeImmediateWord(0xec);
        case OPERATION.CM:
            return getCodeImmediateWord(0xfc);
        case OPERATION.CALL:
            return getCodeImmediateWord(0xcd);

        case OPERATION.PCHL:
            return getCodeSingleValue(0xe9);
        case OPERATION.SPHL:
            return getCodeSingleValue(0xf9);
        case OPERATION.XCHG:
            return getCodeSingleValue(0xeb);
        case OPERATION.XTHL:
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
