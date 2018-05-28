function AnnotationController(_logger, _parseable, _annotationIndex) {

    const 
        logger = _logger,
        parseable = _parseable,
        annotationIndex = _annotationIndex;

    let actions = {
        returnedObjectRequestCallback: null,
        replaceAnnotationWithLine: null,
        insertBelowLineOfApplication: null,
        insertAtEnd: null
    }

    this.getLineOfApplication = getLineOfApplication;
    this.insertBelowLineOfApplication = insertBelowLineOfApplication;
    this.insertAtEnd = insertAtEnd;
    this.requestReturnedObject = requestReturnedObject;
    this.replaceAnnotationWithLine = replaceAnnotationWithLine;
    this.throwError = throwError;
    this.getActions = getActions;

    function getLineOfApplication() {
        return parseable.getNextNonAnnotationLine(annotationIndex);
    }

    function insertBelowLineOfApplication(line) {
        if(typeof line === 'string') {
            actions.insertBelowLineOfApplication = line;
        } else {
            logger.error('AnnotationController.insertBelowLineOfApplication() must take a string parameter!');
        }
    }

    function insertAtEnd(line) {
        if(typeof line === 'string') {
            actions.insertAtEnd = line;
        } else {
            logger.error('AnnotationController.insertBelowLineOfApplication() must take a string parameter!');
        }
    }

    function requestReturnedObject(callback) {
        if(typeof callback === 'function') {
            actions.returnedObjectRequestCallback = callback;
        } else {
            logger.error('AnnotationController.requestReturnedObject() must take a valid callback function!');
        }
    }

    function replaceAnnotationWithLine(line) {
        if(typeof line === 'string') {
            actions.replaceAnnotationWithLine = line;
        } else {
            logger.error('AnnotationController.replaceAnnotationWithLine() must take a string parameter!');
        }
    }

    function throwError(message) {
        logger.error(message);
    }

    function getActions() {
        return actions;
    }
}

module.exports = AnnotationController;