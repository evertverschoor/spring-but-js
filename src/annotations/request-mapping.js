// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function RequestMapping(url, method) {

    this.isRequestHandler = true;
    this.url = url || '/';
    this.method = method || 'GET';
}

module.exports = RequestMapping;