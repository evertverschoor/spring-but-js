const 
    AnnotationRegistry = require('./annotation-subsystem/annotation-registry'),
    AnnotationParser = require('./annotation-subsystem/annotation-parser'),
    BeanPool = require('./bean-pool'),
    ComponentScanner = require('./annotation-subsystem/component-scanner'),
    WebServer = require('./web-server'),
    Logger = require('./logger');

const
    springButJs = {},
    logger = new Logger(),
    annotationRegistry = new AnnotationRegistry(logger),
    parser = new AnnotationParser(annotationRegistry),
    beanPool = new BeanPool(logger),
    componentScanner = new ComponentScanner(parser, logger),
    webServer = new WebServer(logger);

function loadAnnotations() {
    require('./annotations/autowired')(springButJs);
    require('./annotations/component')(springButJs, logger);
    // require('./annotations/controller')(springButJs, webServer, logger);
}

springButJs.createAnnotation = annotationRegistry.createAnnotation;
springButJs.createBean = beanPool.addBean;
springButJs.createProvider = beanPool.addProvider;
springButJs.inject = beanPool.getBean;
springButJs.enableComponentScan = componentScanner.scanDirectory;
springButJs.printAvailableAnnotations = annotationRegistry.printAvailableAnnotations;

loadAnnotations();

module.exports = springButJs;