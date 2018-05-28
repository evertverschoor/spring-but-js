const MethodMapping = require('./method-mapping');

function ControllerMapping(_controllerName, _controllerRequestMapping) {

    this.controllerName = _controllerName;
    this.mapping = _controllerRequestMapping + '/';
    this.addMethodMapping = addMethodMapping;

    const registeredMethodMappings = {};

    function addMethodMapping(methodName, methodRequestMapping, requestMethod) {
        if(registeredMethodMappings[methodName] == null) {
            return registeredMethodMappings[methodName] = new MethodMapping(methodName, methodRequestMapping, requestMethod);
        } else {
            throw 'The method ' + _controllerName + '.' + methodName + '() has already been mapped!';
        }
    }
}

module.exports = ControllerMapping;