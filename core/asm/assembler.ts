import {Parser} from "./parser";
import {AsmOperand, AsmOperands, AsmOperation, Lines, SymbolMap} from "./interface";
import {OPERATION} from "../interface/operation/operation.types";
import {HighLowFN} from "../util/high-low.function";

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
            LXI: 3, MVI: 2, SHLD: 3, LHLD: 3, STA: 3, LDA: 3, JNZ: 3, JMP: 3, CNZ: 3, ADI: 2, JZ: 3, CZ: 3,
            CALL: 3, ACI: 2, JNC: 3, OUT: 2, CNC: 3, SUI: 2, JC: 3, IN: 2, CC: 3, SBI: 2, JPO: 3, CPO: 3,
            ANI: 2, JPE: 3, CPE: 3, XRI: 2, JP: 3, CP: 3, ORI: 2, JM: 3, CM: 3, CPI: 2
        };
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

    function singleValue(value: number): number[] {
        if (!operation.operands) {
            return [value];
        }
        assertOperandCount(operation.operands, 0);
        return [value];
    }

    function assertOperandCount(operands: AsmOperands, count: number) {
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

    function resolveSymbol(symbolMap: SymbolMap, operand: AsmOperand): AsmOperand {
        const value = symbolMap[operand];
        if (value !== undefined) {
            return resolveSymbol(symbolMap, value)
        }
        return operand;
    }

    function getRegisterPair(operand: AsmOperand, symbolMap: SymbolMap) {
        const symbol = resolveSymbol(symbolMap, operand);
        if (+symbol & 1) {
            throw new Error('invalid value')
        }
        return assertNumericValue(symbol) >> 1
    }

    function getRegister(operand: AsmOperand, symbolMap: SymbolMap) {
        return assertValueBetween(assertNumericValue(resolveSymbol(symbolMap, operand)), 0, 7);
    }

    function lowHigh(number: number): number[] {
        assertValueBetween(number, 0, 0xffff);
        const hl = HighLowFN.toHighLow(number);
        return [hl.low, hl.high]
    }

    function value(number: number): number {
        return assertValueBetween(number, 0, 0xff);
    }

    function getCodeRegisterOperation(code: number, operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 1);
        const reg = getRegister(operands[0], symbolMap);
        return [code + (reg << 3)];

    }

    function getCodeRegisterPairOperation(code: number, operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 1);
        const reg = assertValueBetween(getRegisterPair(operands[0], symbolMap), 0, 3);
        return [code + (reg << 4)];

    }

    function getCodeHalfRegisterPairOperation(code: number, operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 1);
        const reg = assertValueBetween(getRegisterPair(operands[0], symbolMap), 0, 1);
        return [code + (reg << 4)];

    }

    function getCodeImmediateWord(code: number, operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 1);
        return [code, ...lowHigh(assertNumericValue(resolveSymbol(symbolMap, operands[0])))];
    }

    function getCodeImmediateByte(code: number, operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 1);
        return [code, value(assertNumericValue(resolveSymbol(symbolMap, operands[0])))];
    }


    function getCodeLXI(operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 2);
        const reg = assertValueBetween(getRegisterPair(operands[0], symbolMap), 0, 3);
        return [0x01 + (reg << 4), ...lowHigh(assertNumericValue(operands[1]))];
    }

    function getCodePOP(operands: AsmOperands, symbolMap: SymbolMap): number[] {
        return getCodeRegisterPairOperation(0xc1, operands, symbolMap)
    }

    function getCodePUSH(operands: AsmOperands, symbolMap: SymbolMap): number[] {
        return getCodeRegisterPairOperation(0xc5, operands, symbolMap)
    }


    function getCodeMVI(operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 2);
        const reg = getRegister(operands[0], symbolMap);
        return [0x06 + (reg << 3), assertValueBetween(assertNumericValue(operands[1]), 0, 0xff)];
    }


    function getCodeMOV(operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 2);
        const reg0 = getRegister(operands[0], symbolMap);
        const reg1 = getRegister(operands[1], symbolMap);
        if (reg0 === 6 && reg1 === 6) {
            throw new Error('invalid operation');
        }
        return [0x40 + reg1 + (reg0 << 3)];
    }

    function getCodeAluA(code: number, operands: AsmOperands, symbolMap: SymbolMap): number[] {
        assertOperandCount(operands, 1);
        const reg = getRegister(operands[0], symbolMap);
        return [code + reg];
    }


    switch (operation.code) {
        case OPERATION.NOP:
            return singleValue(0x00);
        case OPERATION.LXI:
            return getCodeLXI(operation.operands, symbolMap);
        case OPERATION.STAX:
            return getCodeHalfRegisterPairOperation(0x02, operation.operands, symbolMap);
        case OPERATION.SHLD:
            return getCodeImmediateWord(0x22, operation.operands, symbolMap);
        case OPERATION.STA:
            return getCodeImmediateWord(0x32, operation.operands, symbolMap);
        case OPERATION.INX:
            return getCodeRegisterPairOperation(0x03, operation.operands, symbolMap);
        case OPERATION.INR:
            return getCodeRegisterOperation(0x04, operation.operands, symbolMap);
        case OPERATION.DCR:
            return getCodeRegisterOperation(0x05, operation.operands, symbolMap);
        case OPERATION.MVI:
            return getCodeMVI(operation.operands, symbolMap);
        case OPERATION.RLC:
            return singleValue(0x07);
        case OPERATION.RAL:
            return singleValue(0x17);
        case OPERATION.DAA:
            return singleValue(0x27);
        case OPERATION.STC:
            return singleValue(0x37);
        case OPERATION.DAD:
            return getCodeRegisterPairOperation(0x09, operation.operands, symbolMap);
        case OPERATION.LDAX:
            return getCodeHalfRegisterPairOperation(0x0a, operation.operands, symbolMap);
        case OPERATION.LHLD:
            return getCodeImmediateWord(0x2a, operation.operands, symbolMap);
        case OPERATION.LDA:
            return getCodeImmediateWord(0x3a, operation.operands, symbolMap);
        case OPERATION.DCX:
            return getCodeRegisterPairOperation(0x0b,operation.operands, symbolMap);

        case OPERATION.RRC:
            return singleValue(0x0f);
        case OPERATION.RAR:
            return singleValue(0x1f);
        case OPERATION.CMA:
            return singleValue(0x2f);
        case OPERATION.CMC:
            return singleValue(0x3f);
        // -------------
        case OPERATION.MOV:
            return getCodeMOV(operation.operands, symbolMap);
        case OPERATION.HLT:
            return singleValue(0x76);
        // -------------
        case OPERATION.ADD:
            return getCodeAluA(0x80, operation.operands, symbolMap);
        case OPERATION.ADC:
            return getCodeAluA(0x88, operation.operands, symbolMap);
        case OPERATION.SUB:
            return getCodeAluA(0x90, operation.operands, symbolMap);
        case OPERATION.SBB:
            return getCodeAluA(0x98, operation.operands, symbolMap);
        case OPERATION.ANA:
            return getCodeAluA(0xa0, operation.operands, symbolMap);
        case OPERATION.XRA:
            return getCodeAluA(0xa8, operation.operands, symbolMap);
        case OPERATION.ORA:
            return getCodeAluA(0xb0, operation.operands, symbolMap);
        case OPERATION.CMP:
            return getCodeAluA(0xb8, operation.operands, symbolMap);
        // -------------
        case OPERATION.RNZ:
            return singleValue(0xc0);
        case OPERATION.RNC:
            return singleValue(0xd0);
        case OPERATION.RPO:
            return singleValue(0xe0);
        case OPERATION.RP:
            return singleValue(0xf0);
        case OPERATION.POP:
            return getCodePOP(operation.operands, symbolMap);

        case OPERATION.JNZ:
            return getCodeImmediateWord(0xc2, operation.operands, symbolMap);
        case OPERATION.JNC:
            return getCodeImmediateWord(0xd2, operation.operands, symbolMap);
        case OPERATION.JPO:
            return getCodeImmediateWord(0xe2, operation.operands, symbolMap);
        case OPERATION.JP:
            return getCodeImmediateWord(0xf2, operation.operands, symbolMap);

        case OPERATION.JZ:
            return getCodeImmediateWord(0xca, operation.operands, symbolMap);
        case OPERATION.JC:
            return getCodeImmediateWord(0xda, operation.operands, symbolMap);
        case OPERATION.JPE:
            return getCodeImmediateWord(0xea, operation.operands, symbolMap);
        case OPERATION.JM:
            return getCodeImmediateWord(0xfa, operation.operands, symbolMap);
        case OPERATION.JMP:
            return getCodeImmediateWord(0xc3, operation.operands, symbolMap);


        case OPERATION.XTHL:
            return singleValue(0xe3);

        case OPERATION.CNZ:
            return getCodeImmediateWord(0xc4, operation.operands, symbolMap);
        case OPERATION.CNC:
            return getCodeImmediateWord(0xd4, operation.operands, symbolMap);
        case OPERATION.CPO:
            return getCodeImmediateWord(0xe4, operation.operands, symbolMap);
        case OPERATION.CP:
            return getCodeImmediateWord(0xf4, operation.operands, symbolMap);

        case OPERATION.CZ:
            return getCodeImmediateWord(0xcc, operation.operands, symbolMap);
        case OPERATION.CC:
            return getCodeImmediateWord(0xdc, operation.operands, symbolMap);
        case OPERATION.CPE:
            return getCodeImmediateWord(0xec, operation.operands, symbolMap);
        case OPERATION.CM:
            return getCodeImmediateWord(0xfc, operation.operands, symbolMap);
        case OPERATION.CALL:
            return getCodeImmediateWord(0xcd, operation.operands, symbolMap);



        case OPERATION.PUSH:
            return getCodePUSH(operation.operands, symbolMap);

        case OPERATION.ADI:
            return getCodeImmediateByte(0xc6, operation.operands, symbolMap);
        case OPERATION.SUI:
            return getCodeImmediateByte(0xd6, operation.operands, symbolMap);
        case OPERATION.ANI:
            return getCodeImmediateByte(0xe6, operation.operands, symbolMap);
        case OPERATION.ORI:
            return getCodeImmediateByte(0xf6, operation.operands, symbolMap);

        case OPERATION.ACI:
            return getCodeImmediateByte(0xce, operation.operands, symbolMap);
        case OPERATION.SBI:
            return getCodeImmediateByte(0xde, operation.operands, symbolMap);
        case OPERATION.XRI:
            return getCodeImmediateByte(0xee, operation.operands, symbolMap);
        case OPERATION.CPI:
            return getCodeImmediateByte(0xfe, operation.operands, symbolMap);

        case OPERATION.RZ:
            return singleValue(0xc8);
        case OPERATION.RC:
            return singleValue(0xd8);
        case OPERATION.RPE:
            return singleValue(0xe8);
        case OPERATION.RM:
            return singleValue(0xf8);
        case OPERATION.RET:
            return singleValue(0xc9);
        case OPERATION.PCHL:
            return singleValue(0xe9);
        case OPERATION.SPHL:
            return singleValue(0xf9);

        case OPERATION.XCHG:
            return singleValue(0xeb);

    }


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
