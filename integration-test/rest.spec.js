// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    SpringButJsType = require('../src/spring-but-js'),
    SpringButJsInstance = new SpringButJsType(),
    http = require('http'),
    SPEC_COUNT = 7; // <= Keep this up to date!

SpringButJsInstance.disableLogging();
let isComponentsScanned = false,
    finishedSpecCount = 0;

describe('SpringButJs - creating REST endpoints', () => {

    it('should properly set up GET /test1/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test1/hello?data=test', 'GET').then(response => {
                expect(response).toEqual('[GET] Hello from Test1Controller! Data: test');
                onSpecFinished();
                done();
            });
        });
    });

    it('should properly set up GET /test2/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test2/hello?data=test', 'GET').then(response => {
                expect(response).toEqual('[GET] Hello from Test2Controller! Data: test');
                onSpecFinished();
                done();
            });
        });
    });

    it('should properly set up POST /test1/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test1/hello', 'POST').then(response => {
                expect(response).toEqual('[POST] Hello from Test1Controller! Data: test');
                onSpecFinished();
                done();
            });
        });
    });

    it('should properly set up PUT /test2/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test2/hello', 'PUT').then(response => {
                expect(response).toEqual('[PUT] Hello from Test2Controller! Data: test');
                onSpecFinished();
                done();
            });
        });
    });

    it('should properly set up PATCH /test2/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test2/hello', 'PATCH').then(response => {
                expect(response).toEqual('[PATCH] Hello from Test2Controller! Data: test');
                onSpecFinished();
                done();
            });
        });
    });

    it('should properly set up DELETE /test1/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test1/hello?data=test', 'DELETE').then(response => {
                expect(response).toEqual('[DELETE] Hello from Test1Controller! Data: test');
                onSpecFinished();
                done();
            });
        });
    });

    it('should properly set up OPTIONS /test1/hello', (done) => {
        scanComponents().then(() => {
            doRequest('/test1/hello', 'OPTIONS').then(response => {
                expect(response).toEqual('[OPTIONS] Hello from Test1Controller!');
                onSpecFinished();
                done();
            });
        });
    });
});

// Because we can't use afterAll() to shut down...
function onSpecFinished() {
    finishedSpecCount++;
    if(finishedSpecCount >= SPEC_COUNT) {
        SpringButJsInstance.shutDown();
    }
}

function scanComponents() {
    return new Promise((resolve, reject) => {
        if(!isComponentsScanned) {
            SpringButJsInstance.scanComponents(__dirname + '/rest.components')
            .then(resolve)
            .catch(reject);

            isComponentsScanned = true;
        } else {
            resolve();
        }
    });
}

/**
 * Perform an HTTP request with the given URL and request method.
 * In the case of everything but GET requests, add {data:"test"} to the request body.
 */
function doRequest(url, method) {
    return new Promise((resolve, reject) => {
        if(SpringButJsInstance.isServerRunning()) {
            let useRequest = true;

            switch(method) {
                case 'GET':
                    useRequest = false;
                    break;
            }

            const handler = resp => {
                let data = '';
                
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                
                resp.on('end', () => {
                    resolve(data);
                });
            }

            if(useRequest) {
                const options = {
                    host: 'localhost',
                    port: SpringButJsInstance.getPort(),
                    path: url,
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const request = http.request(options, handler).on("error", (err) => {
                    reject(err);
                });

                request.write('{"data":"test"}');
                request.end();
            } else {
                http.get(
                    'http://localhost:' + 
                    SpringButJsInstance.getPort() + 
                    url, handler
                ).on("error", (err) => {
                    reject(err);
                });
            }
        } else {
            setTimeout(() => {
                doRequest(url, method).then(resolve).catch(reject);
            }, 10);
        }
    });
}