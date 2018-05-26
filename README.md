[![Build Status](https://travis-ci.org/evertverschoor/spring-but-js.svg?branch=master)](https://travis-ci.org/evertverschoor/spring-but-js)

# Spring but JS
Use Spring features in NodeJS!

### The idea
``` javascript
const SpringButJs = require('spring-but-js');

SpringButJs(() => {

    '@Component'
    function SomeComponent() { 

        '@Autowired'
        let speakerService;
        
        this.someFunction = function() {
            speakerService.speak();
        }
    }

    return SomeComponent;
});

SpringButJs(() => {

    '@Service'
    function SpeakerService() { 
        
        this.speak = function() {
             console.log('Hello from SpeakerService!');
        }
    }

    return SpeakerService;
});

SpringButJs.inject('SomeComponent').someFunction(); // Hello from SpeakerService!
```