// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const Line = require('./line');

function Parseable(_functionAsString) {

    const 
        functionAsString = _functionAsString,
        lines = [];

    this.forEachLine = forEachLine;
    this.getNextNonAnnotationLine = getNextNonAnnotationLine;

    function forEachLine(callback) {
        let stop = false;

        for(let i = 0; i < lines.length && !stop; i++) {
            callback(lines[i], i, () => stop = true);
        }
    }

    function getNextNonAnnotationLine(currentIndex) {
        let nextLine = lines[currentIndex++];

        if(nextLine != null) {
            while(nextLine != null && (nextLine.isAnnotation() || nextLine.isComment())) {
                nextLine = lines[currentIndex++];
            }

            return nextLine;
        } else {
            return null;
        }
    }

    function initialize() {
        functionAsString.split('\n').forEach(l => {
            lines.push(new Line(l));
        });
    }

    initialize();
}

module.exports = Parseable;