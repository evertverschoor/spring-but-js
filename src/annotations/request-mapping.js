// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function RequestMapping(_url, _method) {

    let url = _url || '/',
        method = _method || 'GET';

    if(url.length > 1 && url.substring(url.length - 1, url.length) == '/') {
        url = url.substring(0, url.length -1);
    }
    if(url.length > 1 && url.substring(0, 1) != '/') {
        url = '/' + url;
    }

    this.isRequestHandler = true;
    this.url = url;
    this.method = method;
}

module.exports = RequestMapping;