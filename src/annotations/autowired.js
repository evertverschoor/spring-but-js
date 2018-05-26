function hasValidAutowireableField(line) {
    line = line.trim();
    
    let isProperString = typeof line === 'string' && line.length > 0,
        hasLetOrVar = line.indexOf('let ') == 0 || line.indexOf('var ') == 0,
        hasConst = line.indexOf('const ') == 0,
        hasThisAssignment = line.indexOf('this.') == 0;
    
    return isProperString && (hasLetOrVar || hasThisAssignment) && !hasConst;
}

function getVariableName(line) {
    line = line.trim();

    let cutOffAtFront = line.replace('let ', '').replace('var ', '').replace('this.', ''),
        assignmentIndex = cutOffAtFront.indexOf('='),
        lineEndingIndex = cutOffAtFront.indexOf(';');
    
    if(assignmentIndex > -1) {
        return cutOffAtFront.substring(0, assignmentIndex).trim();
    } else if(lineEndingIndex > -1) {
        return cutOffAtFront.substring(0, lineEndingIndex).trim();
    } else {
        return cutOffAtFront.trim();
    }
}

function parserFunction(sourceLine) {
    if(hasValidAutowireableField(sourceLine)) {
        let variableName = getVariableName(sourceLine);

        return {
            insertLinesBelow: variableName + ' = _SpringButJs.inject(\'' + variableName + '\');'
        };
    } else {
        throw 'Line "' + sourceLine.trim() + '" is not autowireable!';
    }
}

function creationFunction(SpringButJs) {
    let aliases = ['Autowired', 'Inject'];

    aliases.forEach(alias => {
        SpringButJs.createAnnotation(
            alias, 
            parserFunction, 
            'Automatically sets variable values based on available beans.'
        );
    });
}

module.exports = creationFunction;
module.exports.lineHasValidAutowireableField = hasValidAutowireableField;
module.exports.getVariableNameFromLine = getVariableName;