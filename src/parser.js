function Parser(annotationRegistry, annotationHelper) {

    this.parse = parse;
    this.getNonAnnotationNextLine = getNonAnnotationNextLine;

    function isValidParseResult(parseResult) {
        if(parseResult == null) {
            return false;
        } else {
            let hasAnyOneOfValidMembers =   parseResult.throw != null ||
                                            parseResult.insertLinesBelow != null || 
                                            parseResult.provideEntireResult != null;

            return hasAnyOneOfValidMembers;
        }
    }

    function getNonAnnotationNextLine(lines, currentIndex) {
        let nextLine = lines[currentIndex++];

        if(nextLine != null) {
            while(nextLine != null && annotationHelper.lineIsAnnotation(nextLine)) {
                nextLine = lines[currentIndex++];
            }

            return nextLine;
        } else {
            return '';
        }
    }
    
    /**
     * Parse a parseable function or lambda expression or a string that represents one.
     * Return a function that represents the parsed new expression, subject to syntax errors of course.
     */
    function parse(parseable) {

        // Make an array of the original's lines, splitting the string by newline.
        let originalLines = parseable.split('\n'),
            newLines = [],
            consumers = [], // Annotations that want the final parseable
            delayedInsertion = {
                pending: false,
                wait: false,
                values: ''
            }

        // Iterate through the array, checking annotations or pending insertions from previous annotations
        // to create our new lines, representing the proxy expression.
        for(let i = 0; i < originalLines.length; i++) {
            let line = originalLines[i];

            // If an insertion is pending, we might have to perform it now
            if(insertion.pending) {
                if(insertion.wait) {
                    insertion.wait = !insertion.wait;
                } else {
                    insertion.values.forEach(l => newLines.push(l));

                    insertion.pending = false;
                    insertion.wait = false;
                    insertion.values = '';
                }
            }

            // Perform these actions if the current line contains an annotation.
            if(annotationRegistry.lineIsExistingAnnotation(line)) {
                let annotationName = annotationRegistry.getActualAnnotationNameFromLine(line),
                    parseFunction = annotationRegistry.getParseFunction(annotationName);
                
                let nextLine = getNonAnnotationNextLine(originalLines, i),
                    parseResult = parseFunction(nextLine);

                if(isValidParseResult(parseResult)) {
                    // Check which parse result we get, multiple ones can be requested at once
                    if(parseResult.insertLinesBelow) {
                        if(typeof parseResult.insertLinesBelow === 'string') {
                            parseResult.insertLinesBelow = [parseResult.insertLinesBelow];
                        }

                        insertion.pending = true;
                        insertion.wait = true;
                        insertion.values = parseResult.insertLinesBelow;
                    }
                    if(parseResult.provideEntireResult) {
                        consumers.push(parseResult.provideEntireResult);
                    }
                    if(parseResult.throw) {
                        throw parseResult.throw;
                    }
                } else {
                    let toThrow =   'The annotation "@' + annotationName + '" parsed to an invalid result!\n' + 
                                    'The following is an example structure of what to return in this result, each member is optional but one is required:\n\n' + 
                                    '{\n' + 
                                        '\tthrow: \'An error message to throw.\',\n' + 
                                        '\tinsertLinesBelow: [\'// These lines get inserted below\', \ whatever the annotation is above!\'],\n' + 
                                        '\tprovideEntireResult: (entireParseable) => { /* This function receives the entire parseable expression! */ }\' \n' + 
                                    '}';

                    throw toThrow;
                }
            } else {
                newLines.push(line); // No annotation means add this current line as is
            }
        }

        let finalExpressionString = newLines.join('\n'),
            finalExpression = null

        console.log(newLines.join('\n'));

        try {
            finalExpression = new Function(finalExpressionString)
        } catch(err) {
            throw 'The following generated code threw the following syntax error: ' + err + '\n\n' + finalExpressionString;
        }

        let finalFunction = finalExpression();

        if(finalFunction == null) {
            throw   'The following expression does not return anything!\n' + 
                    '(When defining a component, this component should be returned at the bottom of the file)\n\n' + 
                    parseable;
        }

        consumers.forEach(c => { c(finalFunction) });

        return finalFunction;
    }
}

module.exports = Parser;