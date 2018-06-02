// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function BeanPool(_logger) {

    const 
        logger = _logger,
        pool = {},
        providers = {};

    this.addBean = addBean;
    this.addProvider = addProvider;
    this.getBean = getBean;
    this.beanExists = beanExists;
    this.waitForBean = waitForBean;

    function isValidName(name) {
        return typeof name === 'string';
    }

    function addBean(name, value) {
        name = name.toLowerCase();

        if(isValidName(name)) {
            if(pool[name] == null) {
                pool[name] = value;
                logger.log('Created bean with name: ' + name);
            } else {
                logger.error(
                    'A bean called "' + name + '" already exists!\n' + 
                    '(are you defining more than one @Component in a single file?)'
                );
            }
        } else {
            logger.error('"' + name + '" is an invalid bean name!');
        }
    }

    function addProvider(name, providerFunction) {
        name = name.toLowerCase();

        if(isValidName(name)) {
            if(pool[name] == null && providers[name] == null) {
                providers[name] = providerFunction;
            } else {
                logger.error(
                    'A bean called "' + name + '" already exists!\n' + 
                    '(are you defining more than one @Component in a single file?)'
                );
            }
        } else {
            logger.error('"' + name + '" is an invalid bean name!');
        }
    }

    function beanNameIsRequireable(name) {
        try {
            require(name);
            return true;
        } catch(err) {
            return false;
        }
    }

    function getBean(name) {
        name = name.toLowerCase();

        if(pool[name] != null) {
            return pool[name];
        } else if(providers[name] != null) {
            addBean(name, providers[name]());
            return pool[name];
        } else if(beanNameIsRequireable(name)) {
            addBean(name, require(name));
            return pool[name];
        } else {
            logger.error('No bean called "' + name + '" exists!');
        }
    }

    function beanExists(name) {
        name = name.toLowerCase();

        if(pool[name] != null) {
            return true;
        } else if(providers[name] != null) {
            return true;
        } else {
            return false;
        }
    }

    function waitForBean(name, callback) {
        let maxTries = 10,
            currentTries = 0;

        const checker = setInterval(() => {
            if(currentTries >= maxTries) {
                logger.warn('Timed out waiting for bean: "' + name + '"!');
                clearInterval(checker);
            } else if(beanExists(name)) {
                callback(getBean(name));
                clearInterval(checker);
            } else {
                currentTries++;
            }
        }, 5);
    }
}

module.exports = BeanPool;