function Line(_lineAsString) {

    const lineAsString = _lineAsString.trim();

    this.isFunction = isFunction;
    this.isMemberVariable = isMemberVariable;
    this.isVariable = isVariable;
    this.isAnnotation = isAnnotation;
    this.getAnnotationName = getAnnotationName;
    this.getVariableOrFunctionName = getVariableOrFunctionName;
    this.toString = toString;

    function isFunction() {
        return lineAsString.indexOf('function ') == 0;
    }

    function isMemberVariable() {
        return lineAsString.indexOf('this.') == 0;
        
    }

    function isVariable() {
        return  isMemberVariable() ||
                lineAsString.indexOf('let ') == 0 ||
                lineAsString.indexOf('var ') == 0;
    }

    function isAnnotation() {
        if(typeof lineAsString !== 'string' || lineAsString.length < 3) {
            return false;
        } else {
            const QUOTES = ['\'', '"'];
    
            let firstCharIsQuote = QUOTES.indexOf(lineAsString.substring(0, 1)) > -1,
                lastCharIsQuote = QUOTES.indexOf(lineAsString.substring(lineAsString.length - 1, lineAsString.length)) > -1,
                hasAtSignAtSecondChar = lineAsString.substring(1, 2) == '@'
    
            return firstCharIsQuote && lastCharIsQuote && hasAtSignAtSecondChar;
        }
    }

    function getAnnotationName() {
        if(isAnnotation()) {
            let returnValue = lineAsString.replace('@', '');
            return returnValue.substring(1, returnValue.length - 1);
        } else {
            return null;
        }
    }

    function getVariableOrFunctionName() {
        let cutOffAtFront = lineAsString.replace('let ', '').replace('var ', '').replace('this.', '').replace('function ', ''),
            assignmentIndex = cutOffAtFront.indexOf('='),
            lineEndingIndex = cutOffAtFront.indexOf(';'),
            functionEndingIndex = cutOffAtFront.indexOf('()');
        
        if(assignmentIndex > -1) {
            return cutOffAtFront.substring(0, assignmentIndex).trim();
        } else if(lineEndingIndex > -1) {
            return cutOffAtFront.substring(0, lineEndingIndex).trim();
        } else if(functionEndingIndex > -1) {
            return cutOffAtFront.substring(0, functionEndingIndex).trim();
        } else {
            return cutOffAtFront.trim();
        }
    }

    function toString() {
        return lineAsString;
    }
}

module.exports = Line;