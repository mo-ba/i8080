import * as mem from "../impl/memory";
import {IMemory} from "../interface/memory";
import {highLow} from "../util/high-low.function";
import {expect} from "chai";

describe('register test', () => {

    let memory: IMemory;

    beforeEach(() => {
        memory = mem.build();
    });


    it('should store and load', () => {
        memory.store(highLow(0, 0), 128);
        memory.store(highLow(0, 1), 0);
        memory.store(highLow(1, 1), 255);
        expect(memory.load(highLow(0, 0))).to.eq(128);
        expect(memory.load(highLow(0, 1))).to.eq(0);
        expect(memory.load(highLow(1, 1))).to.eq(255);
        memory.store(highLow(0, 0), 127);
        expect(memory.load(highLow(0, 0))).to.eq(127);
        expect(memory.load(highLow(0, 1))).to.eq(0);
        expect(memory.load(highLow(1, 1))).to.eq(255);

    });

});
