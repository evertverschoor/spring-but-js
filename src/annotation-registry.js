function AnnotationRegistry() {

    const registry = {};

    this.createAnnotation = createAnnotation;
    this.lineIsAnnotation = lineIsAnnotation;
    this.getParseFunction = getParseFunction;
    this.getActualAnnotationNameFromLine = getActualAnnotationNameFromLine;

    function isValidAnnotationName(name) {
        return typeof name === 'string' && name.length > 0;
    }
    
    function isValidParseFunction(parseFunction) {
        return typeof parseFunction === 'function';
    }
    
    function createAnnotation(name, parseFunction) {
        if(!isValidAnnotationName(name)) {
            throw 'Please pass a valid annotation name!';
        }
        if(!isValidParseFunction(parseFunction)) {
            throw 'Please pass a valid parse function!';
        }
    
        registry[name] = parseFunction;
    }
    
    function lineIsAnnotation(line) {
        if(typeof line !== 'string' || line.length < 3) {
            return false;
        } else {
            line = line.trim();
    
            const QUOTES = ['\'', '"'];
    
            let firstCharIsQuote = QUOTES.indexOf(line.substring(0, 1)) > -1,
                lastCharIsQuote = QUOTES.indexOf(line.substring(line.length - 1, line.length)) > -1,
                annotationName = getActualAnnotationNameFromLine(line),
                hasAtSignAtSecondChar = line.substring(1, 2) == '@'
    
            return firstCharIsQuote && lastCharIsQuote && hasAtSignAtSecondChar && getParseFunction(annotationName) != null;
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
}

module.exports = AnnotationRegistry;