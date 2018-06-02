// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

function getAutowireNamesFromFunction(fromFunction) {
    const 
        signatureLine = fromFunction.toString().split('\n')[0],
        argumentListAsString = signatureLine.substring(
                signatureLine.indexOf('(') + 1,
                signatureLine.indexOf(')')
        ),
        argumentList = argumentListAsString.split(',').map(a => formatBeanName(a));

    return argumentList;
}

function formatBeanName(name) {
    return name.replace('_', '').trim();
}

function parse(annotationController, SpringButJs) {
    const 
        applicableLine = annotationController.getLineOfApplication(),
        isMemberVariable = applicableLine.isMemberVariable(),
        variableName = applicableLine.getVariableOrFunctionName(),
        args = annotationController.getArguments(),
        beanName = args[0] != null ? args[0] : variableName;

    if(beanName.substring(0, 1) == '_') {
        beanName = formatBeanName(beanName);
    }

    // Set the value of a private variable that is not constant
    // by inserting a line that sets it below
    if(applicableLine.isVariable() && !applicableLine.isConst() && !applicableLine.isMemberVariable()) {
        let lineToInsert = isMemberVariable ? 'this.' : '';
        lineToInsert += variableName + ' = _SpringButJs.inject(\'' + beanName + '\');';

        annotationController.insertBelowLineOfApplication(lineToInsert);
    } 
    
    // Set the value of a public variable by accessing it from outside,
    // functions are autowired like this too
    else if(applicableLine.isMemberVariable()) {
        annotationController.requestReturnedObject(ReturnedObject => {
            // @Autowired always appears after @Component and such,
            // so we are free to assume the bean IS indeed available.
            const 
                bean = SpringButJs.inject(ReturnedObject.name), 
                member = bean[variableName];

            if(typeof member === 'function') {
                const injectables = [];

                getAutowireNamesFromFunction(member).forEach(a => {
                    injectables.push(SpringButJs.inject(a));
                });

                member.apply(bean, injectables);
            } else {
                bean[variableName] = SpringButJs.inject(beanName);
            }
        });
    }

    else {
        annotationController.throwError('Line "' + applicableLine.toString() + '" is not autowireable!');
    }
}

function create(SpringButJs) {
    let aliases = ['Autowired', 'Inject'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            annotationController => parse(annotationController, SpringButJs), 
            'Automatically sets variable values based on available beans.'
        );
    });
}

module.exports = create;