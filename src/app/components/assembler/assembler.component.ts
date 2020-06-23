import {Component, Inject, OnInit} from '@angular/core';
import {Assembler} from '../../../core/asm/assembler';
import {TOKEN} from '../../cpu/tokens';
import {IMemory} from '../../../core/interface';
import {toHighLow} from '../../../core/util';

@Component({
    selector: 'app-assembler',
    templateUrl: './assembler.component.html',
    styleUrls: ['./assembler.component.scss']
})
export class AssemblerComponent implements OnInit {

    code = `
    MVI A,1
    MVI B,1
    MVI D,BH
    LXI H, MEM
LOOP:
    MOV C,A
    MOV M,A
    INX H
    ADD B
    MOV B,C
    DCR D
    JNZ LOOP

    MOV M,A
    HLT
MEM:`;

    compiled: [number, number][] = [];
    compiledMapped: number[][] = [];
    error = '';

    editorOptions = {theme: 'myCoolTheme', language: 'mySpecialLanguage', automaticLayout: true,};

    constructor(
        @Inject(TOKEN.ASSEMBLER) private assembler: Assembler,
        @Inject(TOKEN.MEMORY) private memory: IMemory,
    ) {
    }

    ngOnInit() {
        this.compile(this.code);
    }

    buildCompiledMapped(input: [number, number][]) {
        let l = 0;
        let arr = [];
        const res = [];
        for (const op of input) {
            const [code, line] = op;
            if (l !== line) {
                l = line;
                arr = [];
                res.push(arr);
            }
            arr.push(code);
        }
        return res;
    }

    compile(code: string) {
        try {
            const opcode = this.assembler.assembleMap(code);
            console.log(opcode);
            this.error = '';
            this.compiled = opcode;
            this.compiledMapped = this.buildCompiledMapped(opcode);
            console.log(this.compiledMapped);
        } catch (e) {
            this.error = e.message;
            this.compiled = [];
        }
    }

    onChange(code: string) {
        this.code = code;
        this.compile(this.code);


    }

    onLoadIntoMemory() {

        const row = (i) => this.compiled[i] || [];
        for (let i = 0; i <= 0xffff; i++) {
            this.memory.store(toHighLow(i), row(i)[0] || 0);
        }
        console.log('compiled');
    }
}
