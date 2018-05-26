function WebServer(logger) {

    let app;

    const HTTP_METHODS = {
        GET: 0,
        POST: 1,
        PUT: 2,
        PATCH: 3,
        DELETE: 4,
        OPTIONS: 5
    }

    this.startServer = startServer;
    this.isServerRunning = isServerRunning;
    this.addEndpoint = addEndpoint;
    this.HTTP_METHODS = HTTP_METHODS;

    function startServer() {
        app = require('express')();
    }

    function isServerRunning() {
        return app != null;
    }

    function addEndpoint(method, url, handler) {
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
}

module.exports = WebServer;