const Parser = require('../src/parser');

let parser = new Parser();

describe('isValidParseable()', () => {

    it('should approve proper parseables', () => {
        expect(parser.isValidParseable(() => new Function())).toBe(true);
        expect(parser.isValidParseable(() => function() {})).toBe(true);
        expect(parser.isValidParseable(() => () => {})).toBe(true);
    });

    it('should reject improper parseables', () => {
        expect(parser.isValidParseable(1)).toBe(false);
        expect(parser.isValidParseable('foo')).toBe(false);
        expect(parser.isValidParseable(() => 1)).toBe(false);
        expect(parser.isValidParseable(() => "foo")).toBe(false);
    });
});