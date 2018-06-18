// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function Bean(_name) {

    const customBeanName = _name || null;

    this.isBean = true;
    this.customBeanName = customBeanName;
    this.hasCustomBeanName = hasCustomBeanName;
    this.getFunctionParameterNames = getFunctionParameterNames;

    function getFunctionParameterNames(fromFunction) {
        let fnStr = fromFunction.toString().replace(STRIP_COMMENTS, ''),
            result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if(result === null) {
            result = [];
        }

        return result;
    }

    function hasCustomBeanName() {
        return customBeanName != null && customBeanName.length > 0;
    }
}

module.exports = Bean;