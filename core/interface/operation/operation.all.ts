import {MiscOperation} from "./misc.operation";
import {DataOperation} from "./data.operation";
import {ArithmeticLogicOperation} from "./arithmetic-logic.operation";
import {BranchCallOperation} from "./branch/call.operation";
import {BranchJumpOperation} from "./branch/jump.operation";
import {BranchReturnOperation} from "./branch/return.operation";


export type OperationT =
    BranchCallOperation |
    BranchJumpOperation |
    BranchReturnOperation |
    MiscOperation |
    DataOperation |
    ArithmeticLogicOperation
