function Parser(annotationRegistry) {

    this.parse = parse;
    this.isValidParseable = isValidParseable;

    function isValidParseable(parseable) {
        return  typeof parseable === 'function' &&
                typeof parseable() === 'function';
    }

    function isValidParseResult(parseResult) {
        if(parseResult == null) {
            return false;
        } else {
            let hasAnyOneOfValidMembers =   parseResult.insertLineBelow != null || 
                                            parseResult.provideEntireResult != null;

            return hasAnyOneOfValidMembers;
        }
    }
    
    /**
     * Parse a parseable function or lambda expression that contains @Annotations.
     * Return a function that represents the parsed new expression, subject to syntax errors of course.
     */
    function parse(parseable) {
        if(!isValidParseable(parseable)) {
            throw 'An invalid parseable function or lambda expression was provided! A parseable expression must also return a function!';
        }
    
        // Make an array of the original's lines, splitting the string by newline.
        let originalLines = parseable.toString().split('\n'),
            newLines = [],
            consumers = [], // Annotations that want the final parseable
            insertion = {
                pending: false,
                wait: false,
                value: ''
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
                    newLines.push(insertion.value);

                    insertion.pending = false;
                    insertion.wait = false;
                    insertion.value = '';
                }
            }

            // Perform these actions if the current line contains an annotation.
            if(annotationRegistry.lineIsAnnotation(line)) {
                let annotationName = annotationRegistry.getActualAnnotationNameFromLine(line),
                    parseFunction = annotationRegistry.getParseFunction(annotationName);
                
                let nextLine = originalLines[i + 1] != null ? originalLines[i + 1] : '',
                    parseResult = parseFunction(nextLine);

                if(isValidParseResult(parseResult)) {
                    // Check which parse result we get, multiple ones can be requested at once
                    if(parseResult.insertLineBelow) {
                        insertion.pending = true;
                        insertion.wait = true;
                        insertion.value = parseResult.insertLineBelow;
                    }
                    if(parseResult.provideEntireResult) {
                        consumers.push(parseResult.provideEntireResult);
                    }
                } else {
                    let toThrow =   'The annotation "@' + annotationName + '" parsed to an invalid result!\n' + 
                                    'The following is an example structure of what to return in this result, each member is optional:\n\n' + 
                                    '{\n' + 
                                        '\tinsertLineBelow: \'// This line gets inserted below whatever the annotation is above!\',\n' + 
                                        '\provideEntireResult: (entireParseable) => { /* This function receives the entire parseable expression! */ }\' \n' + 
                                    '}';

                    throw toThrow;
                }
            } else if(i != 0 && i != originalLines.length - 1) {
                newLines.push(line); // No annotation means add this current line as is
            }
        }

        // console.log(newLines.join('\n'));

        let finalExpressionString = newLines.join('\n'),
            finalFunction = new Function(finalExpressionString)();

        consumers.forEach(c => { c(finalFunction) });

        return finalFunction;
    }
}

module.exports = Parser;