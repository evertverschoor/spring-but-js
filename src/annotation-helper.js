function AnnotationHelper() {

    this.sourceLineIsMemberVariable = sourceLineIsMemberVariable;
    this.sourceLineIsVariable = sourceLineIsVariable;
    this.lineIsAnnotation = lineIsAnnotation;

    function sourceLineIsMemberVariable(line) {
        return  line.indexOf('this.') == 0;
    }

    function sourceLineIsVariable(line) {
        return  sourceLineIsMemberVariable(line) ||
                line.indexOf('let ') == 0 ||
                line.indexOf('var ') == 0;
    }

    function lineIsAnnotation(line) {
        if(typeof line !== 'string' || line.length < 3) {
            return false;
        } else {
            line = line.trim();
    
            const QUOTES = ['\'', '"'];
    
            let firstCharIsQuote = QUOTES.indexOf(line.substring(0, 1)) > -1,
                lastCharIsQuote = QUOTES.indexOf(line.substring(line.length - 1, line.length)) > -1,
                hasAtSignAtSecondChar = line.substring(1, 2) == '@'
    
            return firstCharIsQuote && lastCharIsQuote && hasAtSignAtSecondChar;
        }
    }
}

module.exports = AnnotationHelper;