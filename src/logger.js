function Logger() {

    const PREFIX = '[SpringButJs]: ';

    this.log = log;
    this.info = info;
    this.error = logError;

    function log(message) {
        console.log('LOG ' + PREFIX + message);
    }

    function info(message) {
        console.log('INFO ' + PREFIX + message);
    }

    function logError(message) {
        console.error('ERROR ' + PREFIX + message);
    }
}

module.exports = Logger;