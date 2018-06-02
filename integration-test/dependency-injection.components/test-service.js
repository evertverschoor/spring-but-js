'@Service'
function TestService() {

    '@Autowired'
    let https;

    let rimraf;

    '@Autowired'
    this.setRimraf = function(_rimraf) {
        rimraf = _rimraf;
    }

    this.getHello = function() {
        return 'Hello from TestService!';
    }

    this.hasRimrafAvailable = function() {
        return rimraf != null && typeof rimraf === 'function';
    }

    this.hasHttpsAvailable = function() {
        return https != null && typeof https === 'object';
    }
}