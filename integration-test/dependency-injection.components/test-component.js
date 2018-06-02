'@Component'
function TestComponent() {

    '@Autowired'
    let testService;

    '@Inject("TestRepository")'
    let myTestRepository;

    this.getHello = function() {
        return 'Hello from TestComponent! ' + testService.getHello() + ' ' + myTestRepository.getHello();
    }
}