import {IMemory} from "../core/interface";
import {highLow} from "../core/util";
import {async, TestBed} from "@angular/core/testing";
import {TOKEN} from "../app/cpu/tokens";
import {CpuModule} from "../app/cpu/cpu.module";

describe('memory test', () => {

    let memory: IMemory;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CpuModule
            ],
        }).compileComponents();
    }));
    beforeEach(() => {
        memory = TestBed.get(TOKEN.MEMORY);
    });


    it('should store and load', () => {
        memory.store(highLow(0, 0), 128);
        memory.store(highLow(0, 1), 0);
        memory.store(highLow(1, 1), 255);
        expect(memory.load(highLow(0, 0))).toEqual(128);
        expect(memory.load(highLow(0, 1))).toEqual(0);
        expect(memory.load(highLow(1, 1))).toEqual(255);
        memory.store(highLow(0, 0), 127);
        expect(memory.load(highLow(0, 0))).toEqual(127);
        expect(memory.load(highLow(0, 1))).toEqual(0);
        expect(memory.load(highLow(1, 1))).toEqual(255);

    });

});
