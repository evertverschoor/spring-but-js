'@Component'
function TestComponent() {

    let myTestRepository;

    '@Autowired'
    this.testService = null;

    '@Autowired("TestRepository")'
    this.setMyTestRepository = function(someOtherName) {
        myTestRepository = someOtherName;
    }

    this.getHello = function() {
        return 'Hello from TestComponent! ' + this.testService.getHello() + ' ' + myTestRepository.getHello();
    }
}