'@Configuration'
function TestConfiguration() {

    '@Bean("fooBean")'
    this.getFooBean = function() {
        return 'foo';
    }

    '@Bean'
    this.bar = function(_rimraf) {
        if(_rimraf == null) {
            throw 'Rimraf is null at a @Bean declaration!';
        }
        return 'bar';
    }
}