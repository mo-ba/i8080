import {IMemory, IProcessor} from "../core/interface";
import {toHighLow} from "../core/util";
import {async, TestBed} from "@angular/core/testing";
import {CpuModule} from "../app/cpu/cpu.module";
import {TOKEN} from "../app/cpu/tokens";

let memory: IMemory;
let processor: IProcessor;

describe('processor test', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CpuModule
            ],
        }).compileComponents();
    }));
    beforeEach(() => {

        memory = TestBed.get(TOKEN.MEMORY);
        processor = TestBed.get(TOKEN.PROCESSOR);
    });

    it('should stop', () => {
        memory.store(toHighLow(0), 0x7e)
        expect(processor.getStopped()).not.toEqual(true);
    })
    it('should fibonacci', () => {
        expect(memory).not.toEqual(null);
        expect(processor).not.toEqual(null);
        const program = [
            0x3e, 0x01,         // a = 1
            0x06, 0x01,         // b = 1
            0x16, 0x05,         // d = 5

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
            memory.store(toHighLow(i), program[i])
        }
        while (!processor.getStopped()) processor.next()

        expect(memory.load(toHighLow(0xffff))).toEqual(13);

    });
    it('should multiply', () => {
        expect(memory).not.toEqual(null);
        expect(processor).not.toEqual(null);
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

        for (let i = 0; i < program.length; i++) {
            memory.store(toHighLow(i), program[i])
        }
        while (!processor.getStopped()) {
            processor.next()
        }

        expect(memory.load(toHighLow(0xfffe))).toEqual(143);
        expect(memory.load(toHighLow(0xffff))).toEqual(1);

    });
});
