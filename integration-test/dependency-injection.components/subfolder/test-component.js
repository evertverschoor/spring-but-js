'@Component'
function TestComponent() {

    let myTestRepository;

    '@Autowired'
    this.testService = null;

    '@Autowired("TestRepository", "SpringButJs")'
    this.setMyTestRepository = function(someOtherName, _springButJs) {
        myTestRepository = someOtherName;

        if(_springButJs == null) {
            throw 'SpringButJs was not properly autowired!';
        }
    }

    this.getHello = function() {
        return 'Hello from TestComponent! ' + this.testService.getHello() + ' ' + myTestRepository.getHello();
    }
}