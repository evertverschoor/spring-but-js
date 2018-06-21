// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    AnnotationRegistry = require('./annotation-subsystem/annotation-registry'),
    MetadataManager = require('./annotation-subsystem/metadata-manager'),
    WebServer = require('./web-server'),
    BeanPool = require('./bean-pool'),
    JsFileScanner = require('./annotation-subsystem/js-file-scanner'),
    Logger = require('./logger'),
    ProfileManager = require('./profile-manager'),
    Parseable = require('./annotation-subsystem/parseable');

function SpringButJs() {

    const
        self = this,
        logger = new Logger(),
        annotationRegistry = new AnnotationRegistry(logger),
        metadataManager = new MetadataManager(annotationRegistry, logger),
        profileManager = new ProfileManager(logger),
        webServer = new WebServer(logger),
        beanPool = new BeanPool(logger, metadataManager, profileManager, webServer),
        jsFileScanner = new JsFileScanner(logger);
        
    this.scanComponents = scanComponents;
    this.inject = beanPool.getBean;
    this.logger = logger;
    this.openBrowser = webServer.openBrowser;
    this.isServerRunning = webServer.isServerRunning;
    this.onEndpointRegistered = webServer.onEndpointRegistered;
    this.getPort = webServer.getPort;
    this.setPort = webServer.setPort;
    this.getProfile = profileManager.getProfile;
    this.setProfile = profileManager.setProfile;
    this.quit = webServer.stop;

    function onLoad() {
        // Load all annotations
        annotationRegistry.register(require('./annotations/autowired'));
        annotationRegistry.register(require('./annotations/component'));
        annotationRegistry.register(require('./annotations/service'));
        annotationRegistry.register(require('./annotations/repository'));
        annotationRegistry.register(require('./annotations/configuration'));
        annotationRegistry.register(require('./annotations/rest-controller'));
        annotationRegistry.register(require('./annotations/bean'));
        annotationRegistry.register(require('./annotations/profile'));
        annotationRegistry.register(require('./annotations/post-construct'));
        annotationRegistry.register(require('./annotations/request-mapping'));

        beanPool.addBean('SpringButJs', self);
    }

    function parseSpringButJsFiles(files) {
        const 
            components = [],
            ids = [];

            files.forEach(f => {
            const parseable = new Parseable(f.content, f.filePath);
            if(parseable.canBeComponent()) {
                metadataManager.parseForMetadata(parseable);

                const 
                    id = parseable.getId(),
                    Type = parseable.getFunction(),
                    componentMaybe = beanPool.processType(Type, id);

                if(componentMaybe) {
                    const metadataId = Type.name + ':' + id;

                    components.push(componentMaybe);
                    ids.push(metadataId);
                }
            }
        });

        for(let i = 0; i < components.length; i++) {
            beanPool.processBeansOfInstance(components[i], ids[i]);
        }
        
        for(let i = 0; i < components.length; i++) {
            beanPool.processInstance(components[i], ids[i]);
        }
    }

    function scanComponents(directory, commandLineArguments) {
        profileManager.parseCommandLineArguments(commandLineArguments);

        return new Promise((resolve, reject) => {
            jsFileScanner.getJsContentsInDirectory(directory).then(files => {
                parseSpringButJsFiles(files);
                resolve();
            }).catch(reject);
        });
    }

    onLoad();
}

module.exports = SpringButJs;