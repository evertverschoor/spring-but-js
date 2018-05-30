// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function AnnotationController(_logger, _parseable, _annotationIndex, _arguments) {

    const 
        logger = _logger,
        parseable = _parseable,
        annotationIndex = _annotationIndex,
        annotationArguments = _arguments;

    let actions = {
        returnedObjectRequestCallback: null,
        replaceAnnotationWithLine: null,
        insertBelowLineOfApplication: null,
        insertAtBeginning: null,
        insertAtEnd: null,
        insertAdditionalAnnotations: null
    }

    this.getArguments = getArguments;
    this.getLineOfApplication = getLineOfApplication;
    this.insertBelowLineOfApplication = insertBelowLineOfApplication;
    this.insertAtBeginning = insertAtBeginning;
    this.insertAtEnd = insertAtEnd;
    this.requestReturnedObject = requestReturnedObject;
    this.replaceAnnotationWithLine = replaceAnnotationWithLine;
    this.insertAdditionalAnnotations = insertAdditionalAnnotations;
    this.throwError = throwError;
    this.getActions = getActions;

    function getArguments() {
        return annotationArguments;
    }

    function getLineOfApplication() {
        return parseable.getNextNonAnnotationLine(annotationIndex);
    }

    function insertBelowLineOfApplication(line) {
        if(typeof line === 'string') {
            actions.insertBelowLineOfApplication = line;
        } else {
            logger.error('AnnotationController.insertBelowLineOfApplication() must take a string parameter!');
        }
    }

    function insertAtBeginning(line) {
        if(typeof line === 'string') {
            actions.insertAtBeginning = line;
        } else {
            logger.error('AnnotationController.insertAtBeginning() must take a string parameter!');
        }
    }

    function insertAtEnd(line) {
        if(typeof line === 'string') {
            actions.insertAtEnd = line;
        } else {
            logger.error('AnnotationController.insertAtEnd() must take a string parameter!');
        }
    }

    function requestReturnedObject(callback) {
        if(typeof callback === 'function') {
            actions.returnedObjectRequestCallback = callback;
        } else {
            logger.error('AnnotationController.requestReturnedObject() must take a valid callback function!');
        }
    }

    function replaceAnnotationWithLine(line) {
        if(typeof line === 'string') {
            actions.replaceAnnotationWithLine = line;
        } else {
            logger.error('AnnotationController.replaceAnnotationWithLine() must take a string parameter!');
        }
    }

    function insertAdditionalAnnotations(annotations) {
        if(typeof annotations === 'string') {
            actions.insertAdditionalAnnotations = [annotations.substring(0, 1) == '@' ? annotations : '@' + annotations];
        } else if(Array.isArray(annotations)) {
            actions.insertAdditionalAnnotations = annotations.map(a => a.substring(0, 1) == '@' ? a : '@' + a);
        } else {
            logger.error('AnnotationController.replaceAnnotationWithLine() must take a string parameter!');
        }
    }

    function throwError(message) {
        logger.error(message);
    }

    function getActions() {
        return actions;
    }
}

module.exports = AnnotationController;