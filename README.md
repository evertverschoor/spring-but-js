# Spring but JS 

[![NPM](https://nodei.co/npm/spring-but-js.png)](https://nodei.co/npm/spring-but-js/)

[![Build Status](https://travis-ci.org/evertverschoor/spring-but-js.svg?branch=master)](https://travis-ci.org/evertverschoor/spring-but-js) 

Use annotations and Spring Inversion of Control in NodeJS! Easily set up a REST endpoint like you would in a Spring Boot application.

Not actually affiliated with Spring.

# Install
```
npm install spring-but-js --save
```

# A demonstration
Below is a small project that makes use of SpringButJs, showcasing simple IoC and Web MVC mechanics to set up a web service.

### main.js
``` javascript
const SpringButJs = require('spring-but-js');
SpringButJs.scanComponents('components');
```

### components/my-service.js
``` javascript
'@Service'
function MyService() {

    this.getHello = function() {
        return 'Hello from MyService!';
    }
}
```

### components/my-controller.js
``` javascript
'@RestController'
'@RequestMapping("/hello")'
function MyController() {

    '@Autowired'
    let myService;

    '@RequestMapping("/")'
    this.myOtherFunction = function(req, res) {
        res.send(myService.getHello());
    }
}
```

```
GET http://localhost/hello => 200: 'Hello from MyService!'
```

# Documentation
View the [GitHub Wiki](https://github.com/evertverschoor/spring-but-js/wiki) for more documentation!