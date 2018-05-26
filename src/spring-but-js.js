const 
    AnnotationRegistry = require('./annotation-registry'),
    Parser = require('./parser'),
    BeanPool = require('./bean-pool');

const
    annotationRegistry = new AnnotationRegistry(),
    parser = new Parser(annotationRegistry),
    beanPool = new BeanPool();

function run(parseable) {
    parser.parse(parseable);
}

function loadAnnotations() {
    require('./annotations/autowired')(springButJs);
    require('./annotations/component')(springButJs);
}

const springButJs = run;
springButJs.createAnnotation = annotationRegistry.createAnnotation;
springButJs.createBean = beanPool.addBean;
springButJs.createProvider = beanPool.addProvider;
springButJs.inject = beanPool.getBean;

loadAnnotations();

module.exports = springButJs