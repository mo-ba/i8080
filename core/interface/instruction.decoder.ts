import {OperationT} from "./operation/operation.all";

export interface InstructionDecoder {
    decode(number: number): OperationT
}
