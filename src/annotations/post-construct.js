// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function parse(SpringButJs, annotationController, logger) {
    const applicableLine = annotationController.getLineOfApplication();

    if(applicableLine.isMemberVariable()) {
        const functionName = applicableLine.getVariableOrFunctionName();

        annotationController.requestReturnedObject(Component => {
            SpringButJs.waitForBean(Component.name, bean => {
                if(bean.hasOwnProperty(functionName)) {
                    bean[functionName]();
                } else {
                    annotationController.throwError(
                        'The function annotated with @PostConstruct either does not exist or is inaccessible!'
                    );
                }
            });
        });
    } else {
        annotationController.throwError('@PostConstruct may only be applied to publicly accessible members!');
    }
}

function create(SpringButJs, logger) {
    let parseProxy = annotationController => {
        return parse(SpringButJs, annotationController, logger);
    };

    let aliases = ['PostConstruct'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            parseProxy, 
            'Registers the annotated function to be called when its bean is first created.'
        );
    });
}

module.exports = create;