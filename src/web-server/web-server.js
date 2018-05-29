// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const ControllerMapping = require('./controller-mapping');

function WebServer(_logger, _SpringButJs) {

    const 
        SpringButJs = _SpringButJs,
        logger = _logger;

    let app,
        port = 0,
        actualPort = port;

    const HTTP_METHODS = {
        GET: 0,
        POST: 1,
        PUT: 2,
        PATCH: 3,
        DELETE: 4,
        OPTIONS: 5
    }

    const 
        markedControllerNames = [],
        registeredControllerMappings = {}; // KEY: controllerName, VALUE: { mapping: 'string', registeredMethodMappings }

    this.HTTP_METHODS = HTTP_METHODS;
    this.getPort = getPort;
    this.setPort = setPort;
    this.startServer = startServer;
    this.isServerRunning = isServerRunning;
    this.markAsController = markAsController;
    this.registerControllerMapping = registerControllerMapping;
    this.registerMethodMapping = registerMethodMapping;
    this.launchEndpoints = launchEndpoints;

    function getPort() {
        return actualPort;
    }

    function setPort(value) {
        port = value;
    }

    function startServer() {
        app = require('express')();
        const server = app.listen(port,  () => {
            actualPort = server.address().port;
            logger.info('The Express server is running on port <' + actualPort + '>!');
        });
    }

    function isServerRunning() {
        return app != null;
    }

    function addEndpointForControllerAndMethod(controllerName, methodName) {
        switch(method) {
            case HTTP_METHODS.GET:
                app.get(url, handler);
                break;
            case HTTP_METHODS.POST:
                app.post(url, handler);
                break;
            case HTTP_METHODS.PUT:
                app.put(url, handler);
                break;
            case HTTP_METHODS.PATCH:
                app.patch(url, handler);
                break;
            case HTTP_METHODS.DELETE:
                app.delete(url, handler);
                break;
            case HTTP_METHODS.OPTIONS:
                app.options(url, handler);
                break;
            default:
                throw '"' + method + ' is an invalid request method!';
        }
        
    }

    function markAsController(name) {
        if(name == null || typeof name !== 'string') {
            throw 'An invalid controller name was passed to WebServer.markAsController()!';
        } else {
            if(markedControllerNames.indexOf(name) > -1) {
                throw 'Controller "' + name + '" has already been registered!';
            } else {
                markedControllerNames.push(name);
                registerControllerMapping(name, '/');
            }
        }
    }

    function registerControllerMapping(name, mapping) {
        if(name == null || typeof name !== 'string') {
            throw 'An invalid controller name was passed to WebServer.registerControllerMapping()! - ' + name;
        }
        if(mapping == null || typeof mapping !== 'string') {
            throw 'An invalid request mapping value was passed to WebServer.registerControllerMapping()! - ' + mapping;
        }

        if(markedControllerNames.indexOf(name) < 0) {
            throw 'The function expression "' + name + '" has not been marked with @Controller or @RestController!';
        } else {
            registeredControllerMappings[name] = new ControllerMapping(name, mapping);
        }
    }

    function isValidRequestMethod(method) {
        if(method == null) {
            return false;
        } else {
            return Object.keys(HTTP_METHODS).map(k => HTTP_METHODS[k]).indexOf(method) > -1;
        }
    }

    function registerMethodMapping(controllerName, methodName, mapping, requestMethod) {    
        if(controllerName == null || typeof controllerName !== 'string') {
            throw 'An invalid controller name was passed to WebServer.registerMethodMapping()! - ' + controllerName;
        }
        if(methodName == null || typeof methodName !== 'string') {
            throw 'An invalid method name was passed to WebServer.registerMethodMapping()! - ' + methodName;
        }
        if(mapping == null || typeof mapping !== 'string') {
            throw 'An invalid request mapping value was passed to WebServer.registerMethodMapping()! - ' + mapping;
        }
        if(!isValidRequestMethod(requestMethod)) {
            throw 'An invalid request method value was passed to WebServer.registerMethodMapping()! - ' + requestMethod;
        }

        if(registeredControllerMappings[controllerName] != null) {
            registeredControllerMappings[controllerName].addMethodMapping(methodName, mapping, requestMethod);
        } else {
            throw 'The controller called "' + controllerName + '" has not been registered yet!';
        }
    }

    function launchEndpoint(controllerMapping, methodMapping) {
        if(!isServerRunning()) {
            startServer();
        }

        let requestMethodString;

            switch(methodMapping.requestMethod) {
                default:
                case HTTP_METHODS.GET:
                    requestMethodString = 'get';
                    break;
                case HTTP_METHODS.POST:
                    requestMethodString = 'post';
                    break;
                case HTTP_METHODS.PUT:
                    requestMethodString = 'patch';
                    break;
                case HTTP_METHODS.PATCH:
                    requestMethodString = 'patch';
                    break;
                case HTTP_METHODS.DELETE:
                    requestMethodString = 'delete';
                    break;
                case HTTP_METHODS.OPTIONS:
                    requestMethodString = 'options';
                    break;
            }

            const URL = getProperUrl(controllerMapping.mapping, methodMapping.mapping);

            app[requestMethodString](
                URL, 
                SpringButJs.inject(controllerMapping.controllerName)[methodMapping.name]
            );

            logger.info(
                'Created new REST endpoint:  ' + requestMethodString.toUpperCase() + 
                ' ' + URL
            );
    }

    function launchEndpoints() {
        Object.keys(registeredControllerMappings).forEach(controllerName => {
            const 
                controllerMapping = registeredControllerMappings[controllerName],
                methodMappings = controllerMapping.getMethodMappings();

            Object.keys(methodMappings).forEach(methodName => {
                const methodMapping = methodMappings[methodName];

                launchEndpoint(controllerMapping, methodMapping);
            });
        });
    }

    function getProperUrl(controllerMapping, methodMapping) {
        let returnValue = (controllerMapping + methodMapping).replace(/\/+/g, '\/');

        if(returnValue.substring(returnValue.length - 1, returnValue.length) == '/') {
            returnValue = returnValue.substring(0, returnValue.length - 1);
        }

        return returnValue;
    }
}

module.exports = WebServer;