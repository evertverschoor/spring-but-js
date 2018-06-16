// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    AnnotationRegistry = require('./annotation-subsystem/annotation-registry'),
    MetadataManager = require('./annotation-subsystem/metadata-manager'),
    BeanPool = require('./bean-pool'),
    JsFileScanner = require('./annotation-subsystem/js-file-scanner'),
    Logger = require('./logger'),
    ProfileManager = require('./profile-manager'),
    Parseable = require('./annotation-subsystem/parseable');

function SpringButJs() {

    const
        logger = new Logger(),
        annotationRegistry = new AnnotationRegistry(logger),
        metadataManager = new MetadataManager(annotationRegistry, logger),
        profileManager = new ProfileManager(logger),
        beanPool = new BeanPool(logger, metadataManager, profileManager),
        jsFileScanner = new JsFileScanner(logger);
        
    this.scanComponents = scanComponents;
    this.logger = logger;

    function onLoad() {
        // Load all annotations
        annotationRegistry.register(require('./annotations/autowired'));
        annotationRegistry.register(require('./annotations/service'));
        annotationRegistry.register(require('./annotations/repository'));
        annotationRegistry.register(require('./annotations/configuration'));
        annotationRegistry.register(require('./annotations/rest-controller'));
        annotationRegistry.register(require('./annotations/bean'));
        annotationRegistry.register(require('./annotations/profile'));
        annotationRegistry.register(require('./annotations/post-construct'));
        annotationRegistry.register(require('./annotations/request-mapping'));
    }

    function scanComponents(directory, commandLineArguments) {
        profileManager.parseCommandLineArguments(commandLineArguments);

        return new Promise((resolve, reject) => {
            jsFileScanner.getJsContentsInDirectory(directory).then(contents => {
                const 
                    components = [],
                    ids = [];

                contents.forEach(c => {
                    const parseable = new Parseable(c);
                    if(parseable.canBeComponent()) {
                        metadataManager.parseForMetadata(parseable);

                        const 
                            id = parseable.getId(),
                            Type = parseable.getFunction(),
                            componentMaybe = beanPool.processType(Type, id);

                        if(componentMaybe) {
                            components.push(componentMaybe);
                            ids.push(Type.name + ':' + id);
                        }
                    }
                });

                for(let i = 0; i < components.length; i++) {
                    beanPool.processBeansOfInstance(components[i], ids[i]);
                }

                for(let i = 0; i < components.length; i++) {
                    beanPool.processInstance(components[i], ids[i]);
                }

                resolve();
            }).catch(reject);
        });
    }

    onLoad();
}

module.exports = SpringButJs;