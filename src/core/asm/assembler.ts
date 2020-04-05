import {Parser} from "./parser";
import {AsmOperand, AsmOperation, Lines, SymbolMap} from "./interface";
import {OPERATION} from "../interface";
import {toHighLow} from "../util";

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
        return size[code] || 1
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
            console.log(instructionCount, size)
        }
    }
    return symbolMap;
}

export function getCode(operation: AsmOperation, symbolMap: SymbolMap): number[] {

    const operands = operation.operands || [];


    function assertOperandCount(count: number) {
        if (operands.length !== count) {
            throw new Error('operand count not ' + count + ' (' + operands.length + ' given)')
        }
        return operands;
    }

    function assertNumericValue(value: AsmOperand): number {
        if (typeof value !== 'number') {
            throw new Error('invalid value')

        }
        return +value
    }

    function assertValueBetween(value: number, lowerBound: number, upperBound: number): number {
        if (value < lowerBound || value > upperBound) {
            throw new Error('invalid value')
        }
        return value
    }

    function resolveSymbol(operand: AsmOperand): AsmOperand {
        const value = symbolMap[operand];
        if (value !== undefined) {
            return resolveSymbol(value)
        }
        return operand;
    }

    function getRegisterPair(operand: AsmOperand) {
        const symbol = resolveSymbol(operand);
        if (+symbol & 1) {
            throw new Error('invalid value')
        }
        return assertNumericValue(symbol) >> 1
    }

    function getRegister(operand: AsmOperand) {
        return assertValueBetween(assertNumericValue(resolveSymbol(operand)), 0, 7);
    }

    function lowHigh(number: number): number[] {
        assertValueBetween(number, 0, 0xffff);
        const hl = toHighLow(number);
        return [hl.low, hl.high]
    }

    function value(number: number): number {
        return assertValueBetween(number, 0, 0xff);
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
        return [code, value(assertNumericValue(resolveSymbol(operands[0])))];
    }


    function getCodeLXI(): number[] {
        assertOperandCount(2);
        const reg = assertValueBetween(getRegisterPair(operands[0]), 0, 3);
        return [0x01 + (reg << 4), ...lowHigh(assertNumericValue(operands[1]))];
    }

    function getCodePOP(): number[] {
        return getCodeRegisterPairOperation(0xc1)
    }

    function getCodePUSH(): number[] {
        return getCodeRegisterPairOperation(0xc5)
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


    const map: { [code: string]: () => number[] } = {
        [OPERATION.NOP]: () => getCodeSingleValue(0x00),
        [OPERATION.LXI]: () => getCodeLXI(),

        [OPERATION.STAX]: () => getCodeHalfRegisterPairOperation(0x02),
        [OPERATION.LDAX]: () => getCodeHalfRegisterPairOperation(0x0a),
        [OPERATION.SHLD]: () => getCodeImmediateWord(0x22),
        [OPERATION.LHLD]: () => getCodeImmediateWord(0x2a),
        [OPERATION.STA]: () => getCodeImmediateWord(0x32),
        [OPERATION.LDA]: () => getCodeImmediateWord(0x3a),

        [OPERATION.INX]: () => getCodeRegisterPairOperation(0x03),
        [OPERATION.DAD]: () => getCodeRegisterPairOperation(0x09),
        [OPERATION.DCX]: () => getCodeRegisterPairOperation(0x0b),

        [OPERATION.INR]: () => getCodeRegisterOperation(0x04),
        [OPERATION.DCR]: () => getCodeRegisterOperation(0x05),

        [OPERATION.RLC]: () => getCodeSingleValue(0x07),
        [OPERATION.RAL]: () => getCodeSingleValue(0x17),
        [OPERATION.DAA]: () => getCodeSingleValue(0x27),
        [OPERATION.STC]: () => getCodeSingleValue(0x37),
        [OPERATION.RRC]: () => getCodeSingleValue(0x0f),
        [OPERATION.RAR]: () => getCodeSingleValue(0x1f),
        [OPERATION.CMA]: () => getCodeSingleValue(0x2f),
        [OPERATION.CMC]: () => getCodeSingleValue(0x3f),


        [OPERATION.MVI]: () => getCodeMVI(),
        [OPERATION.MOV]: () => getCodeMOV(),
        [OPERATION.HLT]: () => getCodeSingleValue(0x76),

        [OPERATION.ADD]: () => getCodeAluA(0x80),
        [OPERATION.ADC]: () => getCodeAluA(0x88),
        [OPERATION.SUB]: () => getCodeAluA(0x90),
        [OPERATION.SBB]: () => getCodeAluA(0x98),
        [OPERATION.ANA]: () => getCodeAluA(0xa0),
        [OPERATION.XRA]: () => getCodeAluA(0xa8),
        [OPERATION.ORA]: () => getCodeAluA(0xb0),
        [OPERATION.CMP]: () => getCodeAluA(0xb8),

        [OPERATION.ADI]: () => getCodeImmediateByte(0xc6),
        [OPERATION.SUI]: () => getCodeImmediateByte(0xd6),
        [OPERATION.ANI]: () => getCodeImmediateByte(0xe6),
        [OPERATION.ORI]: () => getCodeImmediateByte(0xf6),
        [OPERATION.ACI]: () => getCodeImmediateByte(0xce),
        [OPERATION.SBI]: () => getCodeImmediateByte(0xde),
        [OPERATION.XRI]: () => getCodeImmediateByte(0xee),
        [OPERATION.CPI]: () => getCodeImmediateByte(0xfe),

        [OPERATION.PUSH]: () => getCodePUSH(),
        [OPERATION.POP]: () => getCodePOP(),

        [OPERATION.RNZ]: () => getCodeSingleValue(0xc0),
        [OPERATION.RNC]: () => getCodeSingleValue(0xd0),
        [OPERATION.RPO]: () => getCodeSingleValue(0xe0),
        [OPERATION.RP]: () => getCodeSingleValue(0xf0),
        [OPERATION.RZ]: () => getCodeSingleValue(0xc8),
        [OPERATION.RC]: () => getCodeSingleValue(0xd8),
        [OPERATION.RPE]: () => getCodeSingleValue(0xe8),
        [OPERATION.RM]: () => getCodeSingleValue(0xf8),
        [OPERATION.RET]: () => getCodeSingleValue(0xc9),

        [OPERATION.JNZ]: () => getCodeImmediateWord(0xc2),
        [OPERATION.JNC]: () => getCodeImmediateWord(0xd2),
        [OPERATION.JPO]: () => getCodeImmediateWord(0xe2),
        [OPERATION.JP]: () => getCodeImmediateWord(0xf2),
        [OPERATION.JZ]: () => getCodeImmediateWord(0xca),
        [OPERATION.JC]: () => getCodeImmediateWord(0xda),
        [OPERATION.JPE]: () => getCodeImmediateWord(0xea),
        [OPERATION.JM]: () => getCodeImmediateWord(0xfa),
        [OPERATION.JMP]: () => getCodeImmediateWord(0xc3),


        [OPERATION.CNZ]: () => getCodeImmediateWord(0xc4),
        [OPERATION.CNC]: () => getCodeImmediateWord(0xd4),
        [OPERATION.CPO]: () => getCodeImmediateWord(0xe4),
        [OPERATION.CP]: () => getCodeImmediateWord(0xf4),
        [OPERATION.CZ]: () => getCodeImmediateWord(0xcc),
        [OPERATION.CC]: () => getCodeImmediateWord(0xdc),
        [OPERATION.CPE]: () => getCodeImmediateWord(0xec),
        [OPERATION.CM]: () => getCodeImmediateWord(0xfc),
        [OPERATION.CALL]: () => getCodeImmediateWord(0xcd),

        [OPERATION.PCHL]: () => getCodeSingleValue(0xe9),
        [OPERATION.SPHL]: () => getCodeSingleValue(0xf9),
        [OPERATION.XCHG]: () => getCodeSingleValue(0xeb),
        [OPERATION.XTHL]: () => getCodeSingleValue(0xe3),


    };
    return map[operation.code]()


}

export class Assembler {


    constructor(private parser: Parser) {
    }

    public assemble(src: string): number[] {
        const lines = this.parser.parse(src);
        const symbolMap = buildSymbolMap(lines);
        const code: number[] = [];
        for (const line of lines) {
            if (line.operation) {
                code.push(...getCode(line.operation, symbolMap));
            }
        }
        return code;
    }
}
