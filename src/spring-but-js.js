const 
    AnnotationRegistry = require('./annotation-registry'),
    AnnotationHelper = require('./annotation-helper'),
    Parser = require('./parser'),
    BeanPool = require('./bean-pool'),
    ComponentScanner = require('./component-scanner'),
    WebServer = require('./web-server'),
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
    annotationHelper = new AnnotationHelper(),
    annotationRegistry = new AnnotationRegistry(logger, annotationHelper),
    parser = new Parser(annotationRegistry, annotationHelper),
    beanPool = new BeanPool(logger),
    componentScanner = new ComponentScanner(springButJs, logger),
    webServer = new WebServer(logger);



function loadAnnotations() {
    require('./annotations/autowired')(springButJs);
    require('./annotations/component')(springButJs, logger);
    require('./annotations/controller')(springButJs, webServer, logger);
    require('./annotations/rest-annotations')(springButJs, webServer, logger);
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