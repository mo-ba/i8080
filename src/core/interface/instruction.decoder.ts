import {OperationT} from "./operation";

export interface InstructionDecoder {
    decode(number: number): OperationT
}
