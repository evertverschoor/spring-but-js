// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    SpringButJsType = require('../src/spring-but-js'),
    SpringButJsInstance = new SpringButJsType();

SpringButJsInstance.disableLogging();
let isComponentsScanned = false;

describe('SpringButJs - autowiring components', () => {

    it('should properly autowire components, including the rimraf dependency', (done) => {
        scanComponents().then(() => {
            expect(SpringButJsInstance.inject('TestService').hasRimrafAvailable()).toBe(true);
            expect(SpringButJsInstance.inject('TestService').hasHttpsAvailable()).toBe(true);
            expect(SpringButJsInstance.inject('TestComponent').getHello()).toEqual(
                'Hello from TestComponent! Hello from TestService! Hello from TestRepository!'
            );

            done();
        });
    });

    it('should properly autowire autowire defined beans', (done) => {
        scanComponents().then(() => {
            expect(SpringButJsInstance.inject('fooBean')).toEqual('foo');
            expect(SpringButJsInstance.inject('bar')).toEqual('bar');
            done();
        });
    });

    it('should properly call the @PostConstruct function when found', (done) => {
        scanComponents().then(() => {
            expect(SpringButJsInstance.inject('TestRepository').getFoo()).toEqual('foo');
            done();
        });
    });
});

function scanComponents() {
    return new Promise((resolve, reject) => {
        if(!isComponentsScanned) {
            SpringButJsInstance.scanComponents(__dirname + '/dependency-injection.components')
            .then(resolve)
            .catch(reject);

            isComponentsScanned = true;
        } else {
            resolve();
        }
    });
}