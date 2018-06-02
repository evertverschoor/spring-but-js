'@Service'
function TestService() {

    '@Autowired'
    let rimraf;

    this.getHello = function() {
        return 'Hello from TestService!';
    }

    this.hasRimrafAvailable = function() {
        return rimraf != null && typeof rimraf === 'function';
    }
}