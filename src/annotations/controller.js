// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function parserFunction(SpringButJs, annotationController, webServer, logger) {
    const applicableLine = annotationController.getLineOfApplication();

    if(applicableLine.isFunction()) {
        annotationController.insertAdditionalAnnotations('@Component');
        annotationController.requestReturnedObject(Component => {
            webServer.markAsController(Component.name);
        });
    } else {
        annotationController.throwError('@Controller and @RestController may only be applied to function statements!');
    }
}

function creationFunction(SpringButJs, webServer, logger) {
    let proxyParserFunction = annotationController => {
        return parserFunction(SpringButJs, annotationController, webServer, logger);
    };

    let aliases = ['Controller', 'RestController'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            proxyParserFunction, 
            'Sets the annotated class up to handle HTTP requests.'
        );
    });
}

module.exports = creationFunction;