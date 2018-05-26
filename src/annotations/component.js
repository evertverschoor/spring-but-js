function parserFunction(SpringButJs, sourceLine, logger) {
    let consumer = Component => {
        SpringButJs.createProvider(Component.name, () => new Component(SpringButJs));
        logger.log('Created bean with name: ' + Component.name.toLowerCase());
    };

    return {
        provideEntireResult: consumer,
        insertLineBelow: 'const _SpringButJs = arguments[arguments.length - 1];'
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