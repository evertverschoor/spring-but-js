const Parseable = require('./parseable');

function Parser(_annotationRegistry) {

    const annotationRegistry = _annotationRegistry;

    this.parse = parse;
    
    /**
     * Return a parsed function from a string representation of one that contains annotations.
     */
    function parse(functionAsString) {
        const 
            parseable = new Parseable(functionAsString),
            newLines = [],
            resultConsumers = [];

        let delayedInsertions = [];

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

        const joinedString = newLines.join('\n');
        let getResult = null;

        try {
            getResult = new Function(joinedString);
        } catch(err) {
            logger.error(
                'The following generated code threw the following syntax error: ' + 
                err + '\n\n' + finalExpressionString
            );
        }

        const result = getResult();
        if(result == null) {
            logger.error(
                'The following expression does not return anything!\n' + 
                '(When defining a component, this component should be returned at the bottom of the file)\n\n' + 
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