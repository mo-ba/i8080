import {OperationT} from "../interface/operation/operation.all";
import {OPERATION} from "../interface/operation/operation.types";
import {REGISTER} from "../interface/register";

export const registerMap = [
    'B', 'C', 'D', 'E', 'H', 'L', 'M', 'A'
];
export function printOperation(op: OperationT) {


    function register(r: REGISTER) {
        return registerMap[r]
    }

    switch (op.type) {

        case OPERATION.RAR:
        case OPERATION.HLT:
        case OPERATION.NOP:
            return op.type;
        case OPERATION.MOV:
            return op.type + ' ' + register(op.to) + ', ' + register(op.from);
        case OPERATION.MVI:
            return op.type + ' ' + register(op.to) + ', ' + op.value;
        case OPERATION.DCR:
        case OPERATION.ADD:
        case OPERATION.SUB:
        case OPERATION.SBB:
        case OPERATION.ADC:
            return op.type + ' ' + register(op.register);
        case OPERATION.ADI:
        case OPERATION.ACI:
        case OPERATION.SUI:
        case OPERATION.SBI:
            return op.type + ' ' + op.value;
        case OPERATION.JNC :
        case OPERATION.JNZ :
        case OPERATION.JMP :
        case OPERATION.JZ :
            return op.type + ' 0x' + op.position.low.toString(18) + ' 0x' + op.position.low.toString(18);
        default:
            return op;
    }
}
