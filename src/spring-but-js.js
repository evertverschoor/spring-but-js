// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    AnnotationRegistry = require('./annotation-subsystem/annotation-registry'),
    AnnotationParser = require('./annotation-subsystem/annotation-parser'),
    BeanPool = require('./bean-pool'),
    ComponentScanner = require('./annotation-subsystem/component-scanner'),
    WebServer = require('./web-server/web-server'),
    Logger = require('./logger');

function SpringButJs() {

    const
        springButJs = this,
        logger = new Logger(),
        annotationRegistry = new AnnotationRegistry(logger),
        parser = new AnnotationParser(annotationRegistry, logger),
        beanPool = new BeanPool(logger),
        componentScanner = new ComponentScanner(parser, logger),
        webServer = new WebServer(logger, springButJs);

    this.createAnnotation = annotationRegistry.createAnnotation;
    this.createBean = beanPool.addBean;
    this.createProvider = beanPool.addProvider;
    this.inject = beanPool.getBean;
    this.hasBean = beanPool.beanExists;
    this.waitForBean = beanPool.waitForBean;
    this.scanComponents = scanComponents;
    this.printAvailableAnnotations = annotationRegistry.printAvailableAnnotations;
    this.openBrowser = webServer.openBrowser;
    this.setPort = webServer.setPort;
    this.disableLogging = logger.disable;
    this.enableLogging = logger.enable;

    function loadAnnotations() {
        require('./annotations/autowired')(springButJs);
        require('./annotations/component')(springButJs, logger);
        require('./annotations/bean')(springButJs, logger);
        require('./annotations/controller')(springButJs, webServer, logger);
        require('./annotations/request-mapping')(springButJs, webServer, logger);
        require('./annotations/post-construct')(springButJs, webServer, logger);
    }

    function scanComponents(directory) {
        return new Promise((resolve, reject) => {
            componentScanner.scanDirectory(directory).then(() => {
                webServer.launchEndpoints();
                resolve();
            }).catch(reject);
        });
    }

    loadAnnotations();
}

module.exports = SpringButJs;