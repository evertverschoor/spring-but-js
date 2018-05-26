[![Build Status](https://travis-ci.org/evertverschoor/spring-but-js.svg?branch=master)](https://travis-ci.org/evertverschoor/spring-but-js)

# Spring but JS
Use annotations and Spring Inversion of Control in NodeJS! Easily set up a REST endpoint like you would in a Spring Boot application.

# A demonstration
Below is a small project that makes use of SpringButJs, showcasing simple IoC mechanics.

### main.js
``` javascript
const SpringButJs = require('../spring-but-js/src/spring-but-js.js');

SpringButJs.enableComponentScan('components').then(() => {
    SpringButJs.inject('MyOtherComponent').myOtherFunction(); // Hello from MyService!
});
```

### components/my-service.js
``` javascript
'@Service'
function MyService() {

    this.myFunction = function() {
        console.log('Hello from MyService!');
    }
}

return MyService;
```

### components/my-other-component.js
``` javascript
'@Component'
function MyOtherComponent() {

    '@Autowired'
    let myService;

    this.myOtherFunction = function() {
        myService.myFunction();
    }
}

return MyOtherComponent;
```