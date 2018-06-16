// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function ProfileManager(_logger) {

    const logger = _logger;

    let currentProfile;

    this.parseCommandLineArguments = parseCommandLineArguments;
    this.getProfile = getProfile;
    this.setProfile = setProfile;

    function parseCommandLineArguments(args) {
        if(args != null && args.length > 2) {
            args.forEach(arg => {
                if(arg.indexOf('--profile=') == 0) {
                    currentProfile = arg.replace('--profile=', '');
                }
            });
        }

        

        if(currentProfile != null) {
            logger.info('Using profile "' + currentProfile + '".');
        } else {
            logger.info('No profile detected, using default.');
        }
    }

    function getProfile() {
        return currentProfile;
    }

    function setProfile(profile) {
        if(currentProfile == null) {
            currentProfile = profile;
        } else {
            logger.error('The profile cannot be set more than once!');
        }
    }
}

module.exports = ProfileManager;