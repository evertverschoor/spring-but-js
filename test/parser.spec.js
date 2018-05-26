const Parser = require('../src/parser');

/**
 * Return a parser than provides the result to the given consumer function.
 */
function getTestParserWithResultConsumer(consumer) {
    const annotationRegistryMock = {
        lineIsAnnotation: line => line == '\'@Test\'',
        getActualAnnotationNameFromLine: line => 'Test',
        getParseFunction: name => () => { return { provideEntireResult: consumer } }
    };

    return new Parser(annotationRegistryMock);
}

describe('parse()', () => {

    const validTestFunctionAsString =   'function Test() {\n' + 
                                            '\'@Test\'\n' + 
                                            'var myVar = 2;\n' + 
                                            '\'@SomethingElse\'\n' + 
                                            'return myVar;\n' + 
                                        '}\n' + 
                                        '\n' + 
                                        'return Test;';

    const invalidTestFunctionAsString = 'function Test() {\n' + 
                                            '\'@Test\'\n' + 
                                            'var myVar = 2;\n' + 
                                            '\'@SomethingElse\'\n' + 
                                            'return myVar;\n' + 
                                        '}';

    it('should return the function that was returned at the bottom of the parseable', (done) => {
        const resultConsumer = result => {
            expect(typeof result).toBe('function');
            expect(result()).toEqual(2);

            done();
        };

        getTestParserWithResultConsumer(resultConsumer).parse(validTestFunctionAsString);
    });

    it('should remove valid annotations and keep invalid ones', (done) => {
        const resultConsumer = result => {
            expect(result.toString().indexOf('\'@Test\'')).toBeLessThan(0);
            expect(result.toString().indexOf('\'@SomethingElse\'')).toBeGreaterThan(-1);

            done();
        };

        getTestParserWithResultConsumer(resultConsumer).parse(validTestFunctionAsString);
    });

    it('should throw when the parseable returns nothing', () => {
        expect(() => {
            getTestParserWithResultConsumer(result => {}).parse(invalidTestFunctionAsString);
        }).toThrow();
    });
});

