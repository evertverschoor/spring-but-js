const Parseable = require('./parseable');

function Parser(_annotationRegistry, _logger) {

    const 
        annotationRegistry = _annotationRegistry,
        logger = _logger;

    this.parse = parse;
    
    /**
     * Return a parsed function from a string representation of one that contains annotations.
     */
    function parse(functionAsString) {
        const 
            parseable = new Parseable(functionAsString),
            newLines = [],
            resultConsumers = [];

        let delayedInsertions = [],
            finalInsertions = [];

        parseable.forEachLine((l, i) => {
            if(l.isAnnotation()) {
                const actions = annotationRegistry.getAnnotationActions(
                    l.getAnnotationName(), 
                    parseable,
                    i
                );

                if(actions.returnedObjectRequestCallback) {
                    resultConsumers.push(actions.returnedObjectRequestCallback);
                }
                if(actions.replaceAnnotationWithLine) {
                    newLines.push(replaceAnnotationWithLine);
                }
                if(actions.insertBelowLineOfApplication) {
                    delayedInsertions.push(actions.insertBelowLineOfApplication);
                }
                if(actions.insertAtEnd) {
                    finalInsertions.push(actions.insertAtEnd);
                }
            } else {
                newLines.push(l.toString());

                if(delayedInsertions.length > 0) {
                    delayedInsertions.forEach(i => {
                        newLines.push(i);
                    });
                    delayedInsertions = [];
                }
            }
        });

        if(finalInsertions.length > 0) {
            finalInsertions.forEach(i => {
                newLines.push(i);
            });
        }

        const joinedString = newLines.join('\n');
        let getResult = null;

        try {
            getResult = new Function(joinedString);
        } catch(err) {
            logger.error(
                'The following generated code threw the following syntax error: ' + 
                err + '\n\n' + joinedString
            );
        }

        const result = getResult();
        if(typeof result !== 'function') {
            logger.error(
                'When defining a component in a file, it should not return anything!\n\n' + 
                functionAsString
            );
        }

        resultConsumers.forEach(consume => {
            consume(result);
        });

        return joinedString;
    }
}

module.exports = Parser;