import {Parser} from './parser';
import {OPERATION} from '../interface/operation';


describe('Parser test', () => {

    it('should parse 1', () => {
        const result = new Parser().parse(`HELLO: MVI a,   4   ; foo bar%
        `);
        expect(result).toEqual(
            [
                {
                    comment: ' foo bar%', label: 'HELLO', location: {
                        end: {column: 9, line: 2, offset: 39},
                        start: {column: 1, line: 1, offset: 0}
                    },
                    operation: {
                        code: OPERATION.MVI, operands: ['a', 4]
                    }
                }
            ]);
    });

    it('should parse 2', () => {
        const result = new Parser().parse(` MVI   a, 4, 64H`);
        expect(result).toEqual(
            [{
                label: null,
                operation: {code: OPERATION.MVI, operands: ['a', 4, 100]},
                comment: null,
                location: {
                    start: {offset: 1, line: 1, column: 2},
                    end: {offset: 16, line: 1, column: 17}
                }
            }]
        );
    });
    it('should parse 2', () => {
        const result = new Parser().parse(` MVI   a, 4, AAH`);
        expect(result).toEqual(
            [{
                label: null,
                operation: {code: OPERATION.MVI, operands: ['a', 4, 170]},
                comment: null,
                location: {
                    start: {offset: 1, line: 1, column: 2},
                    end: {offset: 16, line: 1, column: 17}
                }
            }]
        );
    });

    it('should parse 3', () => {
        const result = new Parser().parse(` RAR
        HELLO: MVI   a, 4, 64`);
        expect(result).toEqual(
            [{
                label: null,
                operation: {code: OPERATION.RAR, operands: null},
                comment: null,
                location: {
                    start: {offset: 1, line: 1, column: 2},
                    end: {offset: 13, line: 2, column: 9}
                }
            }, {
                label: 'HELLO',
                operation: {code: OPERATION.MVI, operands: ['a', 4, 64]},
                comment: null,
                location: {
                    start: {offset: 13, line: 2, column: 9},
                    end: {offset: 34, line: 2, column: 30}
                }
            }]
        );
    });

    it('should parse 4', () => {
        const result = new Parser().parse(`
        RAR
        HELLO: MVI   a, 1, 64
        HELLO: MVI   b, 2
               MVI   c
        HELLO: MVI d,   4   ; foo bar%
         ; foo bar% !?$§&|<<>>[](){}



        HELLO: MVI   e, 5, 64H`);
        expect(result).toEqual([{
                label: null,
                operation: {code: OPERATION.RAR, operands: null},
                comment: null,
                location: {
                    start: {offset: 9, line: 2, column: 9},
                    end: {offset: 21, line: 3, column: 9}
                }
            }, {
                label: 'HELLO',
                operation: {code: OPERATION.MVI, operands: ['a', 1, 64]},
                comment: null,
                location: {
                    start: {offset: 21, line: 3, column: 9},
                    end: {offset: 51, line: 4, column: 9}
                }
            }, {
                label: 'HELLO',
                operation: {code: OPERATION.MVI, operands: ['b', 2]},
                comment: null,
                location: {
                    start: {offset: 51, line: 4, column: 9},
                    end: {offset: 84, line: 5, column: 16}
                }
            }, {
                label: null,
                operation: {code: OPERATION.MVI, operands: ['c']},
                comment: null,
                location: {
                    start: {offset: 84, line: 5, column: 16},
                    end: {offset: 100, line: 6, column: 9}
                }
            }, {
                label: 'HELLO',
                operation: {code: OPERATION.MVI, operands: ['d', 4]},
                comment: ' foo bar%',
                location: {
                    start: {offset: 100, line: 6, column: 9},
                    end: {offset: 140, line: 7, column: 10}
                }
            }, {
                label: null,
                operation: null,
                comment: ' foo bar% !?$§&|<<>>[](){}',
                location: {
                    start: {offset: 140, line: 7, column: 10},
                    end: {offset: 179, line: 11, column: 9}
                }
            }, {
                label: 'HELLO',
                operation: {code: OPERATION.MVI, operands: ['e', 5, 100]},
                comment: null,
                location: {
                    start: {offset: 179, line: 11, column: 9},
                    end: {offset: 201, line: 11, column: 31}
                }
            }]
        );
    });


});

