// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function Profile(
    profile1, profile2, profile3, profile4, profile5, 
    profile6, profile7, profile8, profile9, profile10
) {
    
    this.runOnProfiles = [];
    this.dontRunOnProfiles = [];

    [   
        profile1, profile2, profile3, profile4, profile5, 
        profile6, profile7, profile8, profile9, profile10
    ].forEach(prof => {
        if(prof != null) {
            if(prof.substring(0, 1) == '!') {
                this.dontRunOnProfiles.push(prof.replace('!', ''));
            } else {
                this.runOnProfiles.push(prof);
            }
        }
    });
}

module.exports = Profile;