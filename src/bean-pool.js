// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    express = require('express');

function BeanPool(_logger, _metadataManager, _profileManager) {

    const 
        logger = _logger,
        metadataManager = _metadataManager,
        profileManager = _profileManager,
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

        if(metadata.Service || metadata.Repository || metadata.Configuration || metadata.RestController) {
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
                    const beanName = metadata.Bean.hasCustomBeanName() ? metadata.Bean.customBeanName : member;
                    addBean(beanName, instance[member]());
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
}

module.exports = BeanPool;