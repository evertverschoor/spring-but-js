// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function MethodMapping(_name, _mapping, _requestMethod) {

    this.name = _name;
    this.mapping = _mapping;
    this.requestMethod = _requestMethod;
}

module.exports = MethodMapping;