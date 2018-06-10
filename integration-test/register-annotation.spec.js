// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    SpringButJsType = require('../src/spring-but-js'),
    SpringButJsInstance = new SpringButJsType(),
    SPEC_COUNT = 2; // <= Keep this up to date!

SpringButJsInstance.disableLogging();
let isComponentsScanned = false,
    finishedSpecCount = 0;

describe('SpringButJs - parsing @IsAlways2', () => {

    registerAnnotation();

    it('should properly parse HasMemberVariable and assign 2 to its variable', (done) => {
        scanComponents().then(() => {
            const testComponent = SpringButJsInstance.inject('HasMemberVariable');
            expect(testComponent.testVariable).toEqual(2);
            onSpecFinished();
            done();
        });
    });

    it('should properly parse HasPrivateVariable but do nothing with @IsAlways2', (done) => {
        scanComponents().then(() => {
            const testComponent = SpringButJsInstance.inject('HasPrivateVariable');
            expect(testComponent.getTestVariable()).toBeUndefined();
            onSpecFinished();
            done();
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
            SpringButJsInstance.scanComponents(__dirname + '/register-annotation.components')
            .then(resolve)
            .catch(reject);

            isComponentsScanned = true;
        } else {
            resolve();
        }
    });
}

function registerAnnotation() {
    SpringButJsInstance.createAnnotation('IsAlways2', parseAnnotation);
}

function parseAnnotation(annotationController) {
    const 
        applicableLine = annotationController.getLineOfApplication(),
        variableName = applicableLine.getVariableOrFunctionName();

    if(applicableLine.isMemberVariable()) {
        annotationController.insertBelowLineOfApplication('this.' + variableName + ' = 2;');
    } else {
        annotationController.throwError('@IsAlways2 can only be applied to member variables!');
    }
}