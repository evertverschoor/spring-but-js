// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const Line = require('./line');

describe('isFunction()', () => {

    it('should return true for function lines', () => {
        expect(new Line('function test() {}').isFunction()).toBe(true);
    });

    it('should return false for non-function lines', () => {
        expect(new Line('var test = 0;').isFunction()).toBe(false);
        expect(new Line('let test = function() {}').isFunction()).toBe(false);
        expect(new Line('this.test = function() {}').isFunction()).toBe(false);
    });
});

describe('isMemberVariable()', () => {

    it('should return true for member variable lines', () => {
        expect(new Line('this.test = 0;').isMemberVariable()).toBe(true);
        expect(new Line('this.test;').isMemberVariable()).toBe(true);
        expect(new Line('this.test = function() {};').isMemberVariable()).toBe(true);
    });

    it('should return false for non-member variable lines', () => {
        expect(new Line('var test = 0;').isMemberVariable()).toBe(false);
        expect(new Line('function test() {}').isMemberVariable()).toBe(false);
    });
});