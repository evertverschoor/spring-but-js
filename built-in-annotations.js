const SpringButJs = require('./src/spring-but-js');

SpringButJs.createAnnotation('Autowired', (sourceLine) => {
    return {
        insertLineBelow: 'myVar = 2;'
    };
});

SpringButJs.createAnnotation('Component', (sourceLine) => {
    let consumer = MyClass => {
        let myInstance = new MyClass();
        myInstance.myFunction();
    };

    return {
        provideEntireResult: consumer
    }
});