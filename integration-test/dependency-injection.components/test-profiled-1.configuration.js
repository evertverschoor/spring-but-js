'@Profile("test")'
'@Configuration'
function TestProfiled1Configuration() {

    '@Bean("ProfileTestBean")'
    this.getProfileTestBean = function() {
        return 1;
    }
}