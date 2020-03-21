import {Parser} from "./parser";

const child_process = require('child_process');

describe('flag test', () => {

    before(() => {
        child_process.execSync('npm run build:parser')
    })

    it('should xAddWithFlags', () => {
        new Parser().parse(`HELLO: MVI a,   4   ; foo bar%
        `)
        new Parser().parse(` MVI   a, 4, 64H`)
        new Parser().parse(` RAR
        HELLO: MVI   a, 4, 64`)
        new Parser().parse(`
        RAR
        HELLO: MVI   a, 1, 64
        HELLO: MVI   b, 2
               MVI   c
        HELLO: MVI d,   4   ; foo bar%
         ; foo bar% !?$§&|<<>>[](){}
         
         
         
        HELLO: MVI   e, 5, 64H`)
    })
})
