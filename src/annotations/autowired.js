// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function hasValidAutowireableField(line) {
    if(line.toString) {
        line = line.toString();
    }

    line = line.trim();
    
    let isProperString = typeof line === 'string' && line.length > 0,
        hasLetOrVar = line.indexOf('let ') == 0 || line.indexOf('var ') == 0,
        hasConst = line.indexOf('const ') == 0,
        hasThisAssignment = line.indexOf('this.') == 0;
    
    return isProperString && (hasLetOrVar || hasThisAssignment) && !hasConst;
}

function parse(annotationController) {
    const 
        applicableLine = annotationController.getLineOfApplication(),
        args = annotationController.getArguments();

    if(hasValidAutowireableField(applicableLine)) {
        const
            variableName = applicableLine.getVariableOrFunctionName(),
            beanName = args[0] != null ? args[0] : variableName;

        annotationController.insertBelowLineOfApplication(variableName + ' = _SpringButJs.inject(\'' + beanName + '\');');
    } else {
        annotationController.throwError('Line "' + applicableLine.toString() + '" is not autowireable!');
    }
}

function create(SpringButJs) {
    let aliases = ['Autowired', 'Inject'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            parse, 
            'Automatically sets variable values based on available beans.'
        );
    });
}

module.exports = create;
module.exports.lineHasValidAutowireableField = hasValidAutowireableField;