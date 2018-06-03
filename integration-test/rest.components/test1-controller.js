'@RestController'
'@RequestMapping("/test1")'
function Test1Controller() {

    '@RequestMapping("/hello")'
    this.getHello = function(req, res) {
        res.send('[GET] Hello from Test1Controller! Data: ' + req.query.data);
    }

    '@RequestMapping("/hello", "POST")'
    this.postHello = function(req, res) {
        res.send('[POST] Hello from Test1Controller! Data: ' + req.body.data);
    }

    '@RequestMapping("/hello", "DELETE")'
    this.deleteHello = function(req, res) {
        res.send('[DELETE] Hello from Test1Controller! Data: ' + req.query.data);
    }

    '@RequestMapping("/hello", "OPTIONS")'
    this.optionsHello = function(req, res) {
        res.send('[OPTIONS] Hello from Test1Controller!');
    }
}