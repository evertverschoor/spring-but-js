// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function Autowired(
    name1, name2, name3, name4, name5, 
    name6, name7, name8, name9, name10
) {
    let customBeanNames = [];

    this.isAutowired = true;
    this.customBeanNames = customBeanNames;

    this.hasCustomBeanNames = hasCustomBeanNames;
    this.getFunctionParameterNames = getFunctionParameterNames;

    function hasCustomBeanNames() {
        return customBeanNames.length > 0;
    }

    function getFunctionParameterNames(fromFunction) {
        let fnStr = fromFunction.toString().replace(STRIP_COMMENTS, ''),
            result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if(result === null) {
            result = [];
        }

        return result;
    }

    [   
        name1, name2, name3, name4, name5, 
        name6, name7, name8, name9, name10
    ].forEach(name => {
        if(name != null) {
            customBeanNames.push(name);
        }
    });
}

module.exports = Autowired;