function parserFunction(SpringButJs, annotationController, webServer, logger) {
    const applicableLine = annotationController.getLineOfApplication();

    if(applicableLine.isFunction()) {
        annotationController.requestReturnedObject(Component => {
            webServer.markAsController(Component.name);
        });
    } else {
        annotationController.throwError('@Controller and @RestController may only be applied to function statements!');
    }
}

function creationFunction(SpringButJs, webServer, logger) {
    let proxyParserFunction = annotationController => {
        return parserFunction(SpringButJs, annotationController, webServer, logger);
    };

    let aliases = ['Controller', 'RestController'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            proxyParserFunction, 
            'Sets the annotated class up to handle HTTP requests.'
        );
    });
}

module.exports = creationFunction;