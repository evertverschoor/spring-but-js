const 
    Parseable = require('./parseable'),
    Line = require('./line');

function Parser(_annotationRegistry, _logger) {

    const 
        annotationRegistry = _annotationRegistry,
        logger = _logger;

    this.parse = parse;

    /**
     * Perform annocation actions based on what the annotation controller returns.
     * Can recursively call itself because annotations can sort of extend others.
     */
    function performAnnotationActions(line, parseable, index, resultConsumers, newLines, delayedInsertions, finalInsertions) {
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
            newLines.push(replaceAnnotationWithLine);
        }
        if(actions.insertBelowLineOfApplication) {
            delayedInsertions.push(actions.insertBelowLineOfApplication);
        }
        if(actions.insertAtEnd) {
            finalInsertions.push(actions.insertAtEnd);
        }
        if(actions.insertAdditionalAnnotations) {
            actions.insertAdditionalAnnotations.forEach(annotation => {
                performAnnotationActions(
                    new Line('"' + annotation + '"'), parseable, index, resultConsumers, newLines, delayedInsertions, finalInsertions
                );
            });
        }
    }
    
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
                performAnnotationActions(
                    l, parseable, i, resultConsumers, newLines, delayedInsertions, finalInsertions
                );
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
        if(result == null) {
            logger.error(
                'The following file does not contain any sort of @Component!\n\n' + 
                functionAsString
            );
        } else if(typeof result !== 'function') {
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