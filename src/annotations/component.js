// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function parse(SpringButJs, annotationController, logger) {
    const applicableLine = annotationController.getLineOfApplication();

    if(applicableLine.isFunction()) {
        annotationController.insertBelowLineOfApplication('const _SpringButJs = arguments[arguments.length - 1];');
        annotationController.insertAtBeginning('var module = {}');
        annotationController.insertAtEnd('return ' + applicableLine.getVariableOrFunctionName() + ';');

        annotationController.requestReturnedObject(Component => {
            SpringButJs.createProvider(Component.name, () => new Component(SpringButJs));
        });
    } else {
        annotationController.throwError(
            'The @Component, @Service, @Configuration and @Repository annotations can only be placed over functions!'
        );
    }
}

function create(SpringButJs, logger) {
    let parseProxy = annotationController => {
        return parse(SpringButJs, annotationController, logger);
    };

    let aliases = ['Component', 'Service', 'Configuration', 'Repository'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            parseProxy, 
            'Registers the annotated function expression as a singleton bean.'
        );
    });
}

module.exports = create;