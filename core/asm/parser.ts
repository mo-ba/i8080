import {parse} from "./asm.gram";


export class Parser {

    parse(asm: string) {
        const result = parse(asm)
        console.log('')
        console.log(result.map((e:any) => JSON.stringify(e)).join('\n'))
    }

}


