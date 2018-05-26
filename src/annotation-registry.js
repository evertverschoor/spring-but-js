function AnnotationRegistry(logger, annotationHelper) {

    const 
        registry = {},
        docs = {};

    this.createAnnotation = createAnnotation;
    this.lineIsExistingAnnotation = lineIsExistingAnnotation;
    this.getParseFunction = getParseFunction;
    this.getActualAnnotationNameFromLine = getActualAnnotationNameFromLine;
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
    
    function lineIsExistingAnnotation(line) {
        if(!annotationHelper.lineIsAnnotation(line)) {
            return false;
        } else {
            let annotationName = getActualAnnotationNameFromLine(line);
            return getParseFunction(annotationName) != null;
        }
    }

    function getParseFunction(annotationName) {
        let attempt = registry[annotationName];

        if(attempt == null) {
            attempt = registry[annotationName.replace('@', '')];

            if(attempt == null) {
                return null;
            } else {
                return attempt;
            }
        } else {
            return attempt;
        }
    }

    function getActualAnnotationNameFromLine(line) {
        line = line.trim().replace('@', '');
        return line.substring(1, line.length - 1);
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