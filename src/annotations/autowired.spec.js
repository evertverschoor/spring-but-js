const autowired = require('./autowired');

describe('lineHasValidAutowireableField()', () => {

    it('should approve proper variable lines', () => {
        expect(autowired.lineHasValidAutowireableField('let foo = "bar";')).toBe(true);
        expect(autowired.lineHasValidAutowireableField('var foo = "bar";')).toBe(true);

        expect(autowired.lineHasValidAutowireableField('let foo;')).toBe(true);
        expect(autowired.lineHasValidAutowireableField('var foo;')).toBe(true);
        expect(autowired.lineHasValidAutowireableField('    var foo;')).toBe(true);

        expect(autowired.lineHasValidAutowireableField('this.foo;')).toBe(true);
        expect(autowired.lineHasValidAutowireableField('this.foo = "bar";')).toBe(true);
    });

    it('should reject improper variable lines', () => {
        expect(autowired.lineHasValidAutowireableField('const foo;')).toBe(false);
        expect(autowired.lineHasValidAutowireableField('const foo = "bar";')).toBe(false);
    });
});