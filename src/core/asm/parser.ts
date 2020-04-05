import {parse} from "./asm.gram";
import {Lines} from "./interface";


export class Parser {

    parse(asm: string): Lines {
        return parse(asm) as Lines;
    }

}


