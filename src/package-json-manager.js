// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const packageJson = require('root-require')('./package.json');

function PackageJsonManager() {

    this.getDependencies = getDependencies;

    function getDependencies() {
        const 
            dependencyNames = packageJson.dependencies != null ? Object.keys(packageJson.dependencies) : [],
            devDependencyNames = packageJson.devDependencies != null ? Object.keys(packageJson.devDependencies) : [];

        return dependencyNames.concat(devDependencyNames);
    }
}

module.exports = PackageJsonManager;