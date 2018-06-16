// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function MetadataManager(_annotationRegistry) {

    const 
        annotationRegistry = _annotationRegistry,
        metadata = {};

    this.getMetadata = getMetadata;
    this.parseForMetadata = parseForMetadata;

    function getMetadata(name) {
        return metadata[name];
    }

    function parseForMetadata(parseable) {
        if(parseable.canBeComponent()) {
            const 
                componentMetadata = {},
                componentName = parseable.getFunction().name,
                componentNameWithId = componentName + ':' + parseable.getId();
        
            parseable.forEachLine((line, index, done) => {
                if(line.isAnnotation()) {
                    const annotation = annotationRegistry.getAnnotation(line.getAnnotationName());

                    if(annotation != null) {
                        const variableName = parseable.getNextNonAnnotationLine(index).getVariableOrFunctionName();

                        if(variableName == componentName) {
                            componentMetadata[annotation.name] = createNewWithArguments(annotation, line.getAnnotationArguments());
                        } else {
                            const memberId = componentNameWithId + '.' + variableName;

                            if(metadata[memberId] == null) {
                                metadata[memberId] = {};
                            }

                            metadata[memberId][annotation.name] = createNewWithArguments(annotation, line.getAnnotationArguments());
                        }
                    }
                }
            });

            metadata[componentNameWithId] = componentMetadata;
        }
    }

    function createNewWithArguments(Type, args) {
        return new Type(
            args[0] || null,
            args[1] || null,
            args[2] || null,
            args[3] || null,
            args[4] || null
        );
    }
}

module.exports = MetadataManager;