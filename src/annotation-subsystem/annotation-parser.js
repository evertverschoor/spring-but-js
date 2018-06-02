// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    Parseable = require('./parseable'),
    Line = require('./line');

function Parser(_annotationRegistry, _logger) {

    const 
        annotationRegistry = _annotationRegistry,
        logger = _logger;

    this.performAnnotationActions = performAnnotationActions;
    this.insertAtEnd = insertAtEnd;
    this.getResultProvider = getResultProvider;
    this.checkResult = checkResult;
    this.provideToConsumers = provideToConsumers;
    this.getParseResult = getParseResult;
    this.parse = parse;

    /**
     * Perform annocation actions based on what the annotation controller returns.
     * Can recursively call itself because annotations can sort of extend others.
     */
    function performAnnotationActions(
        line, parseable, index, 
        resultConsumers, resultAsLines, 
        delayedInsertions, finalInsertions,
        initialInsertions
    ) {

        const actions = annotationRegistry.getAnnotationActions(
            line.getAnnotationName(), 
            parseable,
            index,
            line.getAnnotationArguments()
        );

        if(actions.returnedObjectRequestCallback) {
            resultConsumers.push(actions.returnedObjectRequestCallback);
        }
        if(actions.replaceAnnotationWithLine) {
            resultAsLines.push(replaceAnnotationWithLine);
        }
        if(actions.insertBelowLineOfApplication) {
            delayedInsertions.push(actions.insertBelowLineOfApplication);
        }
        if(actions.insertAtBeginning) {
            initialInsertions.push(actions.insertAtBeginning);
        }
        if(actions.insertAtEnd) {
            finalInsertions.push(actions.insertAtEnd);
        }
        if(actions.insertAdditionalAnnotations) {
            actions.insertAdditionalAnnotations.forEach(annotation => {
                performAnnotationActions(
                    new Line('"' + annotation + '"'), parseable, index,
                    resultConsumers, resultAsLines, delayedInsertions, 
                    finalInsertions, initialInsertions
                );
            });
        }
    }

    /**
     * Insert a list of strings (@toInsert) at the end of an (@array).
     * Return this array.
     */
    function insertAtEnd(array, toInsert) {
        if(toInsert.length > 0) {
            toInsert.forEach(i => {
                array.push(i);
            });
        }

        return array;
    }

    /**
     * Return a function from a function string (@functionString) that provides the parsed result.
     */
    function getResultProvider(functionAsString) {
        let resultProvider = null;

        try {
            resultProvider = new Function(functionAsString);
            return resultProvider;
        } catch(err) {
            throw   'The following generated code threw the following syntax error: ' + 
                    err + '\n\n' + functionAsString;
        }
    }

    /**
     * Check the parsed result and throw exceptions if something's wrong.
     */
    function checkResult(result, originalString) {
        if(result == null) {
            throw   'The following file does not contain any sort of @Component!\n\n' + 
                    originalString;
        } else if(typeof result !== 'function') {
            throw   'When defining a component in a file, it should not return anything!\n\n' + 
                    originalString;
        }
    }

    /**
     * Provide the given object to the given list of consumers.
     */
    function provideToConsumers(toProvide, consumers) {
        consumers.forEach(consume => {
            if(typeof consume !== 'function') {
                throw 'One of the consumers in AnnotationParser.provideToConsumers() is not a function!';
            } else {
                consume(toProvide);
            }
        });
    }

    /**
     * Return a result of parsing the given parseable.
     * Result contains the new function's lines as strings, consumers who want to do something
     * with the result and additional insertions to be done after.
     */
    function getParseResult(parseable, annotationHandler) {
        const returnValue = {
            resultAsLines: [],
            resultConsumers: [],
            insertions: {
                atEnd: [],
                atBeginning: []
            }
        };

        let delayedInsertions = [];

        parseable.forEachLine((l, i) => {
            if(l.isAnnotation()) {
                annotationHandler(
                    l, parseable, i, returnValue.resultConsumers, 
                    returnValue.resultAsLines, delayedInsertions, 
                    returnValue.insertions.atEnd, returnValue.insertions.atBeginning
                );
            } else {
                returnValue.resultAsLines.push(l.toString());

                if(delayedInsertions.length > 0) {
                    delayedInsertions.forEach(i => {
                        returnValue.resultAsLines.push(i);
                    });

                    delayedInsertions = [];
                }
            }
        });

        return returnValue;
    }
    
    /**
     * Return a parsed function from a string representation of one that contains annotations. 
     * (@functionAsString)
     */
    function parse(functionAsString) {
        const 
            parseable = new Parseable(functionAsString),
            parseResult = getParseResult(parseable, performAnnotationActions);
        
        insertAtEnd(parseResult.resultAsLines, parseResult.insertions.atEnd);

        const
            joinedString = parseResult.insertions.atBeginning.concat(parseResult.resultAsLines).join('\n'),
            result = getResultProvider(joinedString)();
        
        checkResult(result, functionAsString);
        provideToConsumers(result, parseResult.resultConsumers);

        return joinedString;
    }
}

module.exports = Parser;