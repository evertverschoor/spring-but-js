function Logger() {

    const PREFIX = '[SpringButJs]: ';

    this.log = log;
    this.info = info;
    this.error = logError;

    function log(message) {
        console.log('\x1b[0m', 'LOG ' + PREFIX + message);
    }

    function info(message) {
        console.log('\x1b[34m', 'INFO ' + PREFIX + message);
        console.log('\x1b[0m', '');
    }

    function logError(message) {
        console.error('\x1b[31m', 'ERROR ' + PREFIX + message);
        console.log('\x1b[0m', '');
    }
}

module.exports = Logger;