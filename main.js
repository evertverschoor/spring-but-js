const SpringButJs = require('./src/spring-but-js');

SpringButJs(() => {

    '@Component'
    function SomeComponent() { 

        '@Autowired'
        let speakerService;
        
        '@PostConstruct'
        this.onConstructed = function() {
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

SpringButJs.inject('SomeComponent').onConstructed();

// SpringButJs(() => {

//     '@Component'
//     class MyEs6Class {

//         constructor() {

//         }

//         myEs6Function() {

//         }
//     }

//     return MyEs6Class;
// });