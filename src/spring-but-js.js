const 
    AnnotationRegistry = require('./annotation-registry'),
    Parser = require('./parser');

const
    annotationRegistry = new AnnotationRegistry(),
    parser = new Parser(annotationRegistry);

function run(parseable) {
    parser.parse(parseable);
}

module.exports = run;
module.exports.createAnnotation = annotationRegistry.createAnnotation;