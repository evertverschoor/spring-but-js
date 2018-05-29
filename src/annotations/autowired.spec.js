// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

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