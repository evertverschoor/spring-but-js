function parserFunction(SpringButJs, sourceLine, webServer, logger) {
    if(SpringButJs.annotationHelper.sourceLineIsMemberVariable(sourceLine)) {
        let consumer = Component => {
            logger.error('TODO: Implement assigning REST endpoints!');
        };
    
        return {
            provideEntireResult: consumer
        }
    } else {
        return {
            throw: 'The @GET, @POST, @PUT, @PATCH, @DELETE and @OPTIONS annotations can only be placed over member variables! (starts with "this.")'
        }
    }
}

function creationFunction(SpringButJs, webServer, logger) {
    let proxyParserFunction = sourceLine => {
        return parserFunction(SpringButJs, sourceLine, webServer, logger);
    };

    let aliases = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            proxyParserFunction, 
            'Sets the annotated function up to become the given HTTP request url\'s handler.'
        );
    });
}

module.exports = creationFunction;