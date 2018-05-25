require('./built-in-annotations.js');

const 
    SpringButJs = require('./src/spring-but-js');

SpringButJs(() => {

    '@Component'
    function MyClass() { 
        
        '@Autowired'
        let myVar;
        
        this.myFunction = function() {
            console.log('Hello ' + myVar);
        }
    }

    return MyClass;
});