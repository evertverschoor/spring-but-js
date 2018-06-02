'@Configuration'
function TestConfiguration() {

    '@Bean("fooBean")'
    this.getFooBean = function() {
        return 'foo';
    }

    '@Bean'
    this.bar = function() {
        return 'bar';
    }
}