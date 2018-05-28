function getRequestMethodFromString(fromString, webServer) {
    switch(fromString) {
        default:
        case 'GET':
            return webServer.HTTP_METHODS.GET;
        case 'POST':
            return webServer.HTTP_METHODS.POST;
        case 'PUT':
            return webServer.HTTP_METHODS.PUT;
        case 'PATCH':
            return webServer.HTTP_METHODS.PATCH;
        case 'DELETE':
            return webServer.HTTP_METHODS.DELETE;
        case 'OPTIONS':
            return webServer.HTTP_METHODS.OPTIONS;
    }
}

function parserFunction(SpringButJs, annotationController, webServer, logger) {
    const applicableLine = annotationController.getLineOfApplication();

    if(applicableLine.isVariable() || applicableLine.isMemberVariable() || applicableLine.isFunction()) {
        const 
            variableName = applicableLine.getVariableOrFunctionName(),
            annotationArguments = annotationController.getArguments();

        annotationController.requestReturnedObject(Component => {
            if(variableName == Component.name) {
                webServer.registerControllerMapping(Component.name, annotationArguments[0]);
            } else {
                webServer.registerMethodMapping(
                    Component.name, 
                    variableName, 
                    annotationArguments[0], 
                    getRequestMethodFromString(
                        annotationArguments[1],
                        webServer
                    )
                );
            }
        });
    } else {
        annotationController.throwError('@RequestMapping must be applied to function statements or variables!');
    }
}

function creationFunction(SpringButJs, webServer, logger) {
    let proxyParserFunction = annotationController => {
        return parserFunction(SpringButJs, annotationController, webServer, logger);
    };

    let aliases = ['RequestMapping'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            proxyParserFunction, 
            'Sets the annotated method up to handle a specific route and request method.'
        );
    });
}

module.exports = creationFunction;