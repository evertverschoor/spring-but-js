// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function parse(SpringButJs, annotationController, logger) {
    const 
        applicableLine = annotationController.getLineOfApplication(),
        args = annotationController.getArguments();

    let _ = 0;

    if(applicableLine.isMemberVariable()) {
        const variableName = applicableLine.getVariableOrFunctionName();

        annotationController.requestReturnedObject(Component => {
            const beanName = args[0] != null ? args[0] : variableName;
            SpringButJs.createProvider(beanName, () => {
                return SpringButJs.inject(Component.name)[variableName]();
            });
        });
    } else {
        annotationController.throwError(
            'The @Bean annotation can only be applied to member variables!'
        );
    }
}

function create(SpringButJs, logger) {
    let parseProxy = annotationController => {
        return parse(SpringButJs, annotationController, logger);
    };

    let aliases = ['Bean'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            parseProxy, 
            'Registers the annotated member function as a bean.'
        );
    });
}

module.exports = create;