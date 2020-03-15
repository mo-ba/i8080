import 'mocha';
import {expect} from 'chai';

import {build as memBuild} from "../impl/memory";
import {build as processorBuild} from "../impl/processor";
import {IMemory} from "../interface/memory";
import {IProcessor} from "../interface/processor";
import {HighLowFN} from "../util/high-low.function";

let memory: IMemory;
let processor: IProcessor;

describe('processor test', () => {

    beforeEach(() => {
        memory = memBuild();
        processor = processorBuild(memory)
    });

    it('should stop', () => {
        memory.store(HighLowFN.toHighLow(0), 0x7e)
        expect(processor.getStopped()).to.not.eq(true);
    })
    it('should fibonacci', () => {
        expect(memory).to.not.eq(null);
        expect(processor).to.not.eq(null);
        const program = [
            0x3e, 0x01,         // a = 1
            0x06, 0x01,         // b = 1
            0x16, 0x05,         // d = 4

            // LOOP:
            0x4f,               // c = a
            0x80,               // a += b
            0x41,               // b = c

            0x15,               // d--;
            0xc2, 0x06, 0x00,   // if !0 -> jump LOOP

            0xf5,               // push PSW;
            0x76,               // halt
        ];


        for (let i = 0; i < program.length; i++) {
            memory.store(HighLowFN.toHighLow(i), program[i])
        }
        while (!processor.getStopped()) processor.next()

        expect(memory.load(HighLowFN.toHighLow(0xffff))).to.eq(13);

    });
    it('should multiply', () => {
        expect(memory).to.not.eq(null);
        expect(processor).to.not.eq(null);
        const program = [
            // 21 * 19 = 399 = 256 + 143
            0x0e, 0x15,         // c = 21
            0x16, 0x13,         // d = 19

            //MULT:
            0x06, 0x00,         // d = 0
            0x1e, 0x09,         // e = 9


            //MULT0:
            0x79,               // a = c
            0x1f,               // rar
            0x4f,               // c = a
            0x1d,               // e--;
            0xca, 0x19, 0x00,   // if 0 -> jump DONE;
            0x78,               // a = c

            0xd2, 0x14, 0x00,   // if !0 -> jump  MULT1:
            0x82,               // a += d

            // MULT1:
            0x1f,               // rar
            0x47,               // b = a
            0xc3, 0x08, 0x00,   // jump  MULT0:

            // DONE:
            0xc5,               // PUSH B
            0x76,               // halt
        ];
        console.log([...program.entries()].map(([k, v]) => [k.toString(16), v.toString(16)]))

        for (let i = 0; i < program.length; i++) {
            memory.store(HighLowFN.toHighLow(i), program[i])
        }
        while (!processor.getStopped()) {
            processor.next()
        }

        expect(memory.load(HighLowFN.toHighLow(0xfffe))).to.eq(143);
        expect(memory.load(HighLowFN.toHighLow(0xffff))).to.eq(1);

    });
});
