const 
    AnnotationRegistry = require('./annotation-registry'),
    Parser = require('./parser'),
    BeanPool = require('./bean-pool'),
    ComponentScanner = require('./component-scanner'),
    Logger = require('./logger');

const logger = new Logger();

function parse(parseable) {
    if(parseable.toString) {
        parseable = parseable.toString();
    }

    try {
        parser.parse(parseable);
    } catch(err) {
        logger.error(err);
    }
}

const springButJs = {};

const
    annotationRegistry = new AnnotationRegistry(logger),
    parser = new Parser(annotationRegistry),
    beanPool = new BeanPool(logger),
    componentScanner = new ComponentScanner(springButJs, logger);



function loadAnnotations() {
    require('./annotations/autowired')(springButJs);
    require('./annotations/component')(springButJs, logger);
}

springButJs.createAnnotation = annotationRegistry.createAnnotation;
springButJs.createBean = beanPool.addBean;
springButJs.createProvider = beanPool.addProvider;
springButJs.inject = beanPool.getBean;
springButJs.enableComponentScan = componentScanner.scanDirectory;
springButJs.parse = parse;
springButJs.printAvailableAnnotations = annotationRegistry.printAvailableAnnotations;

loadAnnotations();

module.exports = springButJs;