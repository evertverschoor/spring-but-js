function parserFunction(SpringButJs, sourceLine) {
    let consumer = Component => {
        SpringButJs.createProvider(Component.name, () => new Component(SpringButJs));
    };

    return {
        provideEntireResult: consumer,
        insertLineBelow: 'const _SpringButJs = arguments[arguments.length - 1];'
    }
}

function creationFunction(SpringButJs) {
    let proxyParserFunction = sourceLine => {
        return parserFunction(SpringButJs, sourceLine);
    };

    SpringButJs.createAnnotation('Component', proxyParserFunction);
    SpringButJs.createAnnotation('Service', proxyParserFunction);
    SpringButJs.createAnnotation('Configuration', proxyParserFunction);
    SpringButJs.createAnnotation('Repository', proxyParserFunction);
}

module.exports = creationFunction;