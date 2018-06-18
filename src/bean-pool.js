// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    express = require('express');

function BeanPool(_logger, _metadataManager, _profileManager, _webServer) {

    const 
        logger = _logger,
        metadataManager = _metadataManager,
        profileManager = _profileManager,
        webServer = _webServer,
        beans = {};

    this.processType = processType;
    this.processBeansOfInstance = processBeansOfInstance;
    this.processInstance = processInstance;
    this.getBean = getBean;

    /**
     * Create an instance of a given type and register it as a bean if the current profile allows it.
     */
    function processType(Type, id) {
        const metadata = metadataManager.getMetadata(Type.name + ':' + id);

        if(metadata.Profile) {
            if(!requirementsMatchCurrentSession(metadata.Profile)) {
                return null;
            }
        }

        let instance = null;

        if(metadata.Service || metadata.Repository || 
            metadata.Configuration || metadata.RestController || metadata.Component) {
                
            instance = new Type();
            addBean(Type.name, instance);
        }

        return instance;
    }

    /**
     * Handle an instance's @Bean definitions and create beans for them.
     */
    function processBeansOfInstance(instance, componentNameWithId) {
        doForEachMemberOfInstanceWithMetadata(instance, componentNameWithId, (member, metadata) => {
            if(typeof instance[member] === 'function') {

                if(metadata.Bean) {
                    const parameters = [];

                    metadata.Bean.getFunctionParameterNames(instance[member]).forEach(p => {
                        parameters.push(getBean(p));
                    });

                    const beanName = metadata.Bean.hasCustomBeanName() ? metadata.Bean.customBeanName : member;
                    const result = instance[member].apply(instance, parameters);
                    
                    addBean(beanName, result);
                }
            }
        });
    }

    /**
     * Handle an instance's members' metadata and inject where needed.
     */
    function processInstance(instance, componentNameWithId) {

        // Handle each @Autowired
        doForEachMemberOfInstanceWithMetadata(instance, componentNameWithId, (member, metadata) => {
            if(metadata.Autowired) {
                if(typeof instance[member] === 'function') {
                    const parameters = [];
    
                    if(metadata.Autowired.hasCustomBeanNames()) {
                        for(let name of metadata.Autowired.customBeanNames) {
                            parameters.push(getBean(name));
                        }
                    } else {
                        metadata.Autowired.getFunctionParameterNames(instance[member]).forEach(p => {
                            parameters.push(getBean(p));
                        });
                    }
    
                    instance[member].apply(instance, parameters);
                } else {
                    const beanName = metadata.Autowired.hasCustomBeanNames() ? 
                                            metadata.Autowired.customBeanNames[0] : member;
                    
                    instance[member] = getBean(beanName);
                }
            }
        });

        // Handle each @RestController and @RequestMapping annotation if applicable
        if(metadataManager.getMetadata(componentNameWithId).RestController) {
            processInstanceAsController(instance, componentNameWithId);
        }

        // Handle each @PostConstruct
        doForEachMemberOfInstanceWithMetadata(instance, componentNameWithId, (member, metadata) => {
            if(typeof instance[member] === 'function') {

                if(metadata.PostConstruct) {
                    instance[member]();
                }
            }
        });
    }

    /**
     * Handle a controller instance's @RequestMapping definitions and create endpoints for them.
     */
    function processInstanceAsController(instance, componentNameWithId) {
        if(webServer.isServerRunning()) {
            const controllerMetadata = metadataManager.getMetadata(componentNameWithId);
            let endpointPrefix = '';
            
            if(controllerMetadata.RequestMapping) {
                endpointPrefix = controllerMetadata.RequestMapping.url;
            }

            // member-level @RequestMapping
            doForEachMemberOfInstanceWithMetadata(instance, componentNameWithId, (member, metadata) => {
                if(typeof instance[member] === 'function') {

                    if(metadata.RequestMapping) {
                        webServer.registerEndpoint(
                            endpointPrefix + metadata.RequestMapping.url, 
                            metadata.RequestMapping.method,
                            instance[member]
                        );
                    }
                }
            });
        } else {
            webServer.setExpressBeans(getBean('express'), getBean('app'));
            webServer.start();

            setTimeout(() => processInstanceAsController(instance, componentNameWithId), 5);
        }
    }

    /**
     * For each member of the given instance, call the given callback with that member's metadata.
     */
    function doForEachMemberOfInstanceWithMetadata(instance, componentNameWithId, callback) {
        Object.keys(instance).forEach(member => {
            const metadata = metadataManager.getMetadata(componentNameWithId + '.' + member);
            
            if(metadata != null) {
                callback(member, metadata);
            }
        });
    }

    /**
     * Determine if profile requirements match the current profile.
     */
    function requirementsMatchCurrentSession(requirements) {
        const currentProfile = profileManager.getProfile();

        if(requirements.dontRunOnProfiles.indexOf(currentProfile) > -1) {
            return false;
        } else if(requirements.runOnProfiles.length > 0 && requirements.runOnProfiles.indexOf(currentProfile) < 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Return a bean with the given name from the bean pool.
     */
    function getBean(name) {
        name = getNormalizedBeanName(name);

        if(beans[name] != null) {
            return beans[name];
        } else if(isExpressBean(name)) {
            createExpressBeans();
            return getBean(name);
        } else if(isRequireableBean(name)) {
            addBean(name, require(name));
            return getBean(name);
        } else {
            throw 'No bean called "' + name + '" exists!';
        }
    }

    /**
     * Add a bean to the bean pool with the given name and value.
     */
    function addBean(name, value) {
        name = getNormalizedBeanName(name);

        if(beans[name] == null) {
            beans[name] = value;
            logger.info('Created bean "' + name + '".');
        } else {
            console.log('OH NO!');
            throw 'A bean called "' + name + '" already exists!';
        }
    }

    function getNormalizedBeanName(name) {
        let returnValue = name = name.trim().toLowerCase();

        if(returnValue.substring(0, 1) == '_') {
            returnValue = returnValue.replace('_', '');
        }

        return returnValue;
    }

    function isExpressBean(name) {
        return name == 'app' || name == 'express';
    }

    function isRequireableBean(name) {
        try {
            require(name);
            return true;
        } catch(err) {
            return false;
        }
}

    function createExpressBeans() {
        const app = express();

        addBean('express', express);
        addBean('app', app);

        webServer.setExpressBeans(express, app)
        webServer.start(app);
    }
}

module.exports = BeanPool;