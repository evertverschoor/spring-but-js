// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const AnnotationParser = require('./annotation-parser');
let annotationParser;

describe('insertAtEnd()', () => {

    annotationParser = new AnnotationParser();

    it('should insert items at the end of an array', () => {
        expect(annotationParser.insertAtEnd([], [1, 2, 3])).toEqual([1, 2, 3]);
        expect(annotationParser.insertAtEnd([4], [1, 2, 3])).toEqual([4, 1, 2, 3]);
    });
});

describe('getResultProvider()', () => {

    annotationParser = new AnnotationParser();

    it('should return a function', () => {
        expect(typeof annotationParser.getResultProvider('')).toEqual('function');
    });

    it('should return a function that returns something when we pass a proper function string', () => {
        const 
            properFunctionString1 = 'return 1;',
            properFunctionString2 = 'function MyComponent() {}; return MyComponent;';

        expect(annotationParser.getResultProvider(properFunctionString1)()).toEqual(1);
        expect(typeof annotationParser.getResultProvider(properFunctionString2)()).toEqual('function');
    });

    it('should throw an error if the given string contains JS syntax errors', () => {
        const improperFunctionString = 'hello this is incorrect';

        try {
            annotationParser.getResultProvider(improperFunctionString);
        } catch(err) {
            expect(err).toContain('The following generated code threw the following syntax error:');
            expect(err).toContain('hello this is incorrect');
        }
    });
});

describe('checkResult()', () => {

    annotationParser = new AnnotationParser();

    it('should do nothing if the result is fine', () => {
        expect(() => {
            annotationParser.checkResult(new Function(), '')
        }).not.toThrow();
    });

    it('should throw if the result is null', () => {
        try {
            annotationParser.checkResult(null, 'originalString');
        } catch(err) {
            expect(err).toContain('The following file does not contain any sort of @Component!');
            expect(err).toContain('originalString');
        }
    });

    it('should throw if the result does not return a function', () => {
        try {
            annotationParser.checkResult(1, 'originalString');
        } catch(err) {
            expect(err).toContain('When defining a component in a file, it should not return anything!');
            expect(err).toContain('originalString');
        }
    });
});

describe('provideToConsumers()', () => {

    annotationParser = new AnnotationParser();

    it('should provide the given value to each consumer', () => {
        let receivedCount = 0;
        expect(receivedCount).toEqual(0);

        const valueToProvide = 'test';
        const consumer = value => { expect(value).toEqual(valueToProvide); receivedCount++; }

        annotationParser.provideToConsumers(valueToProvide, [consumer, consumer]);
        expect(receivedCount).toEqual(2);
    });

    it('should throw if one of the consumers is not a function', () => {
        const valueToProvide = 'test';
        const consumer = value => { expect(value).toEqual(valueToProvide); }

        try {
            annotationParser.provideToConsumers(valueToProvide, [consumer, 'TEST']);
        } catch(err) {
            expect(err).toContain('One of the consumers in AnnotationParser.provideToConsumers() is not a function!');
        }
    });
});