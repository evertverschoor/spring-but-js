// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    Line = require('./line'),
    uuid = require('uuid/v1');

function Parseable(_functionAsString) {

    const 
        functionAsString = _functionAsString,
        lines = [],
        id = uuid();

    let functionAsFunction = null,
        functionName = null;

    this.canBeComponent = canBeComponent;
    this.forEachLine = forEachLine;
    this.getNextNonAnnotationLine = getNextNonAnnotationLine;
    this.hasAnnotation = hasAnnotation;
    this.getFunction = getFunction;
    this.getId = getId;

    /**
     * Return true if a function expression is encountered in this parseable.
     */
    function canBeComponent() {
        for(let line of lines) {
            if(line.isFunction()) {
                if(functionName == null) {
                    functionName = line.getVariableOrFunctionName();
                }

                return true;
            }
        }

        return false;
    }

    function forEachLine(callback) {
        let stop = false;

        for(let i = 0; i < lines.length && !stop; i++) {
            callback(lines[i], i, () => stop = true);
        }
    }

    function getNextNonAnnotationLine(fromIndex) {
        let nextLine = lines[fromIndex + 1];

        if(nextLine != null) {
            while(nextLine != null && (nextLine.isAnnotation() || nextLine.isComment())) {
                nextLine = lines[fromIndex++];
            }

            return nextLine;
        } else {
            return null;
        }
    }

    function hasAnnotation(name) {
        for(let line of lines) {
            if(line.isAnnotation() && line.getAnnotationName() == name) {
                return true;
            }
        }

        return false;
    }

    function getFunction() {
        return functionAsFunction;
    }

    function getId() {
        return id;
    }

    function initialize() {
        functionAsString.split('\n').forEach(l => {
            lines.push(new Line(l));
        });

        if(canBeComponent()) {
            const functionProvider = new Function(functionAsString + '\n\nreturn ' + functionName + ';');
            try {
                functionAsFunction = functionProvider();
            } catch(err) {
                throw err;
            }
        }
    }

    initialize();
}

module.exports = Parseable;