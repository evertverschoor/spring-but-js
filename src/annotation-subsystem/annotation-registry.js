// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const AnnotationController = require('./annotation-controller');

function AnnotationRegistry(_logger) {

    const 
        registry = {},
        docs = {},
        logger = _logger;

    this.createAnnotation = createAnnotation;
    this.getAnnotationActions = getAnnotationActions;
    this.printAvailableAnnotations = printAvailableAnnotations;

    function isValidAnnotationName(name) {
        return typeof name === 'string' && name.length > 0;
    }
    
    function isValidParseFunction(parseFunction) {
        return typeof parseFunction === 'function';
    }
    
    function createAnnotation(name, parseFunction, documentation) {
        if(!isValidAnnotationName(name)) {
            throw 'Please pass a valid annotation name!';
        }
        if(!isValidParseFunction(parseFunction)) {
            throw 'Please pass a valid parse function!';
        }
    
        registry[name] = parseFunction;

        if(documentation != null) {
            docs[name] = documentation;
        }
    }

    function getAnnotationActions(annotationName, parseable, annotationIndex, annotationArguments) {
        let parseFunction = registry[annotationName],
            controller = new AnnotationController(logger, parseable, annotationIndex, annotationArguments);

        if(parseFunction == null) {
            parseFunction = registry[annotationName.replace('@', '')];

            if(parseFunction == null) {
                logger.error('No annotation called "' + annotationName + '" exists!');
                return;
            } else {
                parseFunction(controller);
            }
        } else {
            parseFunction(controller);
        }

        return controller.getActions();
    }


    function printAvailableAnnotations() {
        let annotationNames = Object.keys(registry),
            stringToPrint = '';

        annotationNames.forEach(annotationName => {
            let documentation = docs[annotationName] != null ? docs[annotationName] : 'No documentation available.';
            stringToPrint += '@' + annotationName + '\n' + documentation + '\n\n';
        });

        logger.info('The following annotations are available for use:\n\n' + stringToPrint);
    }
}

module.exports = AnnotationRegistry;