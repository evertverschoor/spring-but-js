'@Service'
function TestService() {

    let https,
        rimraf;

    '@Autowired'
    this.setRimraf = function(_rimraf, _https) {
        rimraf = _rimraf;
        https = _https;
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