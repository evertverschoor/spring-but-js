'@Repository'
function TestRepository() {

    let foo;

    this.getFoo = function() {
        return foo;
    }

    '@PostConstruct'
    this.onConstructed = function() {
        foo = 'foo';
    }

    this.getHello = function() {
        return 'Hello from TestRepository!';
    }
}