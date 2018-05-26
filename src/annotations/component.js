function parserFunction(SpringButJs, sourceLine, logger) {
    if(sourceLine.indexOf('function ') == 0) {
        let consumer = Component => {
            SpringButJs.createProvider(Component.name, () => new Component(SpringButJs));
            logger.log('Created bean with name: ' + Component.name.toLowerCase());
        };
    
        return {
            provideEntireResult: consumer,
            insertLinesBelow: 'const _SpringButJs = arguments[arguments.length - 1];'
        }
    } else {
        return {
            throw: 'The @Component, @Service, @Configuration and @Repository annotations can only be placed over functions!'
        };
    }
}

function creationFunction(SpringButJs, logger) {
    let proxyParserFunction = sourceLine => {
        return parserFunction(SpringButJs, sourceLine, logger);
    };

    let aliases = ['Component', 'Service', 'Configuration', 'Repository'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            proxyParserFunction, 
            'Registers the annotated function expression as a singleton bean.'
        );
    });
}

module.exports = creationFunction;