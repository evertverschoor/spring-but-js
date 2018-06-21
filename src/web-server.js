// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function WebServer(_logger) {

    const
        logger = _logger,
        DEFAULT_PORT = 0;

    let express,
        app,
        server,
        port = DEFAULT_PORT,
        startCommenced = false,
        actualPortReceived = false,
        onEndpointRegisteredCallbacks = [];

    this.start = start;
    this.stop = stop;
    this.setPort = setPort;
    this.getPort = getPort;
    this.setExpressBeans = setExpressBeans;
    this.registerEndpoint = registerEndpoint;
    this.onEndpointRegistered = onEndpointRegistered;
    this.isServerRunning = isServerRunning;
    this.openBrowser = openBrowser;

    function start() {
        if(!startCommenced) {
            startCommenced = true;

            app.use(express.json());

            server = app.listen(port,  () => {
                port = server.address().port;
                logger.info('The Express server is running on port <' + port + '>!');
                actualPortReceived = true;
            });
        }
    }

    function stop() {
        if(actualPortReceived) {
            logger.info('Shutting down the Express server!');
            server.close();
        } else {
            logger.error('Attempt to shut down the Express server but there is none running!');
        }
    }

    function setPort(_port) {
        port = _port;
    }

    function getPort() {
        return port;
    }

    function setExpressBeans(_express, _app) {
        express = _express;
        app = _app;
    }

    function registerEndpoint(url, method, handler) {
        app[method.toLowerCase()](url, handler);

        logger.info(
            'Launched new REST endpoint:  ' + method + ' ' + url
        );

        onEndpointRegisteredCallbacks.forEach(c => c(url, method, handler));
    }

    function onEndpointRegistered(callback) {
        onEndpointRegisteredCallbacks.push(callback);
    }

    function isServerRunning() {
        return actualPortReceived;
    }

    function openBrowser() {
        const maxIntervalCount = 10;
        let currentIntervalCount = 0;

        const checker = setInterval(() => {
            currentIntervalCount++;

            if(currentIntervalCount < maxIntervalCount) {
                if(actualPortReceived) {
                    require('opn')('http://localhost:' + getPort());
                    clearInterval(checker);
                }
            } else {
                clearInterval(checker);
            }
        }, 5);
    }
}

module.exports = WebServer;