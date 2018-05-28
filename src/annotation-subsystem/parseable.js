const Line = require('./line');

function Parseable(_functionAsString) {

    const 
        functionAsString = _functionAsString,
        lines = [];

    this.forEachLine = forEachLine;
    this.getNextNonAnnotationLine = getNextNonAnnotationLine;

    function forEachLine(callback) {
        for(let i = 0; i < lines.length; i++) {
            callback(lines[i], i);
        }
    }

    function getNextNonAnnotationLine(currentIndex) {
        let nextLine = lines[currentIndex++];

        if(nextLine != null) {
            while(nextLine != null && (nextLine.isAnnotation() || nextLine.isComment())) {
                nextLine = lines[currentIndex++];
            }

            return nextLine;
        } else {
            return null;
        }
    }

    function initialize() {
        functionAsString.split('\n').forEach(l => {
            lines.push(new Line(l));
        });
    }

    initialize();
}

module.exports = Parseable;