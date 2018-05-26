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
    const applicableLine = annotationController.getLineOfApplication();

    if(hasValidAutowireableField(applicableLine)) {
        let variableName = applicableLine.getVariableOrFunctionName();
        annotationController.insertBelowLineOfApplication(variableName + ' = _SpringButJs.inject(\'' + variableName + '\');');
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