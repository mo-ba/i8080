import {IWord} from "./word";
import {IRegister} from "./register";

export interface IProgramCounter {

    getProgramCounter(): IWord

    setProgramCounter(programCounter: IWord): IRegister
}
