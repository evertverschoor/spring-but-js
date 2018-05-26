const AnnotationController = require('./annotation-controller');

function AnnotationRegistry(_logger) {

    const 
        registry = {},
        docs = {},
        logger = _logger;

    this.createAnnotation = createAnnotation;
    this.getAnnotationActions = getAnnotationActions;
    this.printAvailableAnnotations = printAvailableAnnotations;

    function isValidAnnotationName(name) {
        return typeof name === 'string' && name.length > 0;
    }
    
    function isValidParseFunction(parseFunction) {
        return typeof parseFunction === 'function';
    }
    
    function createAnnotation(name, parseFunction, documentation) {
        if(!isValidAnnotationName(name)) {
            throw 'Please pass a valid annotation name!';
        }
        if(!isValidParseFunction(parseFunction)) {
            throw 'Please pass a valid parse function!';
        }
    
        registry[name] = parseFunction;

        if(documentation != null) {
            docs[name] = documentation;
        }
    }

    function getAnnotationActions(annotationName, parseable, annotationIndex) {
        let parseFunction = registry[annotationName],
            controller = new AnnotationController(logger, parseable, annotationIndex);

        if(parseFunction == null) {
            parseFunction = registry[annotationName.replace('@', '')];

            if(parseFunction == null) {
                logger.error('No annotation called "' + annotationName + '" exists!');
                return;
            } else {
                parseFunction(controller);
            }
        } else {
            parseFunction(controller);
        }

        return controller.getActions();
    }


    function printAvailableAnnotations() {
        let annotationNames = Object.keys(registry),
            stringToPrint = '';

        annotationNames.forEach(annotationName => {
            let documentation = docs[annotationName] != null ? docs[annotationName] : 'No documentation available.';
            stringToPrint += '@' + annotationName + '\n' + documentation + '\n\n';
        });

        logger.info('The following annotations are available for use:\n\n' + stringToPrint);
    }
}

module.exports = AnnotationRegistry;