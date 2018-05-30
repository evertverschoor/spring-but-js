// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const MethodMapping = require('./method-mapping');

function ControllerMapping(_controllerName, _controllerRequestMapping) {

    this.controllerName = _controllerName;
    this.mapping = _controllerRequestMapping + '/';
    this.addMethodMapping = addMethodMapping;
    this.getMethodMappings = getMethodMappings;

    const registeredMethodMappings = [];

    function addMethodMapping(methodName, methodRequestMapping, requestMethod) {
        if(registeredMethodMappings[methodName] == null) {
            const mapping = new MethodMapping(methodName, methodRequestMapping, requestMethod);
            registeredMethodMappings[methodName] = mapping
            
            return mapping;
        } else {
            throw 'The method ' + _controllerName + '.' + methodName + '() has already been mapped!';
        }
    }

    function getMethodMappings() {
        return registeredMethodMappings;
    }
}

module.exports = ControllerMapping;