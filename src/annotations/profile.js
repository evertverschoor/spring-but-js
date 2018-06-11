// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function parserFunction(SpringButJs, annotationController, profileManager) {
    const 
        applicableLine = annotationController.getLineOfApplication(),
        annotationArguments = annotationController.getArguments();

    if(applicableLine.isFunction()) {
        if(annotationArguments.length > 0 && !profileManager.isCurrentProfile(annotationArguments[0])) {
            annotationController.abandonParsing();
        }
    } else {
        annotationController.throwError(
            'The @Profile annotation can only be placed over functions!'
        );
    }
}

function creationFunction(SpringButJs, profileManager) {
    let proxyParserFunction = annotationController => {
        return parserFunction(SpringButJs, annotationController, profileManager);
    };

    let aliases = ['Profile'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            proxyParserFunction, 
            'Limits the annotated component to only be used under the given profile.'
        );
    });
}

module.exports = creationFunction;