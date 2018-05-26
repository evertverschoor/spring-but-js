function parserFunction(SpringButJs, sourceLine, webServer, logger) {
    if(sourceLine.indexOf('function ') == 0) {
        let consumer = Component => {
            if(!webServer.isServerRunning()) {
                webServer.startServer();
                logger.log('Started the express server!');
            }
        };
    
        return {
            addAnnotations: '\'@Component\'',
            provideEntireResult: consumer
        }
    } else {
        return {
            throw: 'The @Controller and @RestController annotations can only be placed over functions!'
        };
    }
}

function creationFunction(SpringButJs, webServer, logger) {
    let proxyParserFunction = sourceLine => {
        return parserFunction(SpringButJs, sourceLine, webServer, logger);
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