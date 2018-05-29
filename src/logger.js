function Logger() {

    const PREFIX = '[SpringButJs]: ';

    this.log = log;
    this.info = info;
    this.error = logError;
    this.warn = warn;

    function resetColour() {
        console.log('\x1b[0m', '');
    }

    function log(message) {
        console.log('\x1b[0m', 'LOG   ' + PREFIX + message);
        resetColour();
    }

    function info(message) {
        console.log('\x1b[34m', 'INFO  ' + PREFIX + message);
        resetColour();
    }

    function logError(message) {
        console.error('\x1b[31m', 'ERROR ' + PREFIX + message);
        resetColour();
    }

    function warn(message) {
        console.error('\x1b[33m', 'WARN  ' + PREFIX + message);
        resetColour();
    }
}

module.exports = Logger;