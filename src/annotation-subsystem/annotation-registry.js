// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function AnnotationRegistry(_logger) {

    const 
        logger = _logger,
        registry = {};

    this.register = register;
    this.getAnnotation = getAnnotation;

    function register(annotationFunction) {
        registry[annotationFunction.name] = annotationFunction;
    }

    function getAnnotation(name) {
        return registry[name];
    }
}

module.exports = AnnotationRegistry;