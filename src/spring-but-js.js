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
    PackageJsonManager = require('./package-json-manager'),
    Logger = require('./logger');

const
    springButJs = {},
    logger = new Logger(),
    annotationRegistry = new AnnotationRegistry(logger),
    parser = new AnnotationParser(annotationRegistry, logger),
    packageJsonManager = new PackageJsonManager(),
    beanPool = new BeanPool(logger, packageJsonManager),
    componentScanner = new ComponentScanner(parser, logger),
    webServer = new WebServer(logger, springButJs);

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

springButJs.createAnnotation = annotationRegistry.createAnnotation;
springButJs.createBean = beanPool.addBean;
springButJs.createProvider = beanPool.addProvider;
springButJs.inject = beanPool.getBean;
springButJs.hasBean = beanPool.beanExists;
springButJs.waitForBean = beanPool.waitForBean;
springButJs.scanComponents = scanComponents;
springButJs.printAvailableAnnotations = annotationRegistry.printAvailableAnnotations;
springButJs.openBrowser = webServer.openBrowser;
springButJs.setPort = webServer.setPort;

loadAnnotations();

module.exports = springButJs;