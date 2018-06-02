// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function Logger() {

    const PREFIX = '[SpringButJs]: ';
    let isEnabled = true;

    this.log = log;
    this.info = info;
    this.error = logError;
    this.warn = warn;
    this.enable = enable;
    this.disable = disable;

    function resetColour() {
        console.log('\x1b[0m', '');
    }

    function log(message) {
        if(isEnabled) {
            console.log('\x1b[0m', 'LOG   ' + PREFIX + message);
            resetColour();
        }
        
    }

    function info(message) {
        if(isEnabled) {
            console.log('\x1b[34m', 'INFO  ' + PREFIX + message);
            resetColour();
        }
    }

    function logError(message) {
        if(isEnabled) {
            console.error('\x1b[31m', 'ERROR ' + PREFIX + message + '\n');
            console.trace();
            resetColour();
        }
    }

    function warn(message) {
        if(isEnabled) {
            console.error('\x1b[33m', 'WARN  ' + PREFIX + message);
            resetColour();
        }
    }

    function enable() {
        isEnabled = true;
    }

    function disable() {
        isEnabled = false;
    }
}

module.exports = Logger;