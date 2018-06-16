// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function Bean(name) {

    const customBeanName = name || null;

    this.isBean = true;
    this.customBeanName = customBeanName;
    this.hasCustomBeanName = hasCustomBeanName;

    function hasCustomBeanName() {
        return customBeanName.length > 0;
    }
}

module.exports = Bean;