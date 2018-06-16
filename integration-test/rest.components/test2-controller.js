'@RestController'
function Test2Controller() {

    '@RequestMapping("/test2/hello", "GET")'
    this.getHello = function(req, res) {
        res.send('[GET] Hello from Test2Controller! Data: ' + req.query.data);
    }

    '@RequestMapping("/test2/hello", "PUT")'
    this.putHello = function(req, res) {
        res.send('[PUT] Hello from Test2Controller! Data: ' + req.body.data);
    }

    '@RequestMapping("/test2/hello", "PATCH")'
    this.patchHello = function(req, res) {
        res.send('[PATCH] Hello from Test2Controller! Data: ' + req.body.data);
    }
}