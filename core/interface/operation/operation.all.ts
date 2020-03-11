import {MiscOperation} from "./misc.operation";
import {DataOperation} from "./data.operation";
import {ArithmeticLogicOperation} from "./arithmetic-logic.operation";


export type OperationT =
    MiscOperation |
    DataOperation |
    ArithmeticLogicOperation
