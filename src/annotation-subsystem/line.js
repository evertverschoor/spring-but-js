// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function Line(_lineAsString) {

    const lineAsString = _lineAsString.trim();

    this.isComment = isComment;
    this.isFunction = isFunction;
    this.isAnonymousFunction = isAnonymousFunction;
    this.isMemberVariable = isMemberVariable;
    this.isVariable = isVariable;
    this.isAnnotation = isAnnotation;
    this.getAnnotationName = getAnnotationName;
    this.getAnnotationArguments = getAnnotationArguments;
    this.getVariableOrFunctionName = getVariableOrFunctionName;
    this.toString = toString;

    function isComment() {
        return lineAsString.indexOf('//') == 0;
    }

    function isFunction() {
        return lineAsString.indexOf('function ') == 0;
    }

    function isAnonymousFunction() {
        return lineAsString.indexOf('function()') > -1;
    }

    function isMemberVariable() {
        return lineAsString.indexOf('this.') == 0;
        
    }

    function isVariable() {
        return  isMemberVariable() ||
                lineAsString.indexOf('let ') == 0 ||
                lineAsString.indexOf('var ') == 0;
    }

    function isAnnotation() {
        if(typeof lineAsString !== 'string' || lineAsString.length < 3) {
            return false;
        } else {
            const QUOTES = ['\'', '"'];
    
            let firstCharIsQuote = QUOTES.indexOf(lineAsString.substring(0, 1)) > -1,
                lastCharIsQuote = QUOTES.indexOf(lineAsString.substring(lineAsString.length - 1, lineAsString.length)) > -1,
                hasAtSignAtSecondChar = lineAsString.substring(1, 2) == '@'
    
            return firstCharIsQuote && lastCharIsQuote && hasAtSignAtSecondChar;
        }
    }

    function getAnnotationName() {
        const 
            openBracketIndex = lineAsString.indexOf('('),
            closeBracketIndex = lineAsString.indexOf(')');

        if(isAnnotation()) {
            let returnValue = lineAsString.replace('@', '');

            if(openBracketIndex > -1 && closeBracketIndex > openBracketIndex) {
                return returnValue.substring(1, openBracketIndex - 1);
            } else {
                return returnValue.substring(1, returnValue.length - 1);
            }
        } else {
            return null;
        }
    }

    function getAnnotationArguments() {
        const 
            openBracketIndex = lineAsString.indexOf('('),
            closeBracketIndex = lineAsString.indexOf(')');

        if(isAnnotation() && openBracketIndex > -1 && closeBracketIndex > openBracketIndex) {
            let argumentsString = lineAsString.substring(openBracketIndex + 1,  closeBracketIndex),
                argumentsList = argumentsString.split(',');

            return argumentsList.map(a => a.trim().replace(/"/g, '').replace(/'/g, ''));
        } else {
            return [];
        }
    }

    function getVariableOrFunctionName() {
        let cutOffAtFront = lineAsString.replace('let ', '').replace('var ', '').replace('this.', '').replace('function ', ''),
            assignmentIndex = cutOffAtFront.indexOf('='),
            lineEndingIndex = cutOffAtFront.indexOf(';'),
            functionEndingIndex = cutOffAtFront.indexOf('()');
        
        if(assignmentIndex > -1) {
            return cutOffAtFront.substring(0, assignmentIndex).trim();
        } else if(lineEndingIndex > -1) {
            return cutOffAtFront.substring(0, lineEndingIndex).trim();
        } else if(functionEndingIndex > -1) {
            return cutOffAtFront.substring(0, functionEndingIndex).trim();
        } else {
            return cutOffAtFront.trim();
        }
    }

    function toString() {
        return lineAsString;
    }
}

module.exports = Line;