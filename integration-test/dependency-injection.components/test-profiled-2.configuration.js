'@Profile("test2")'
'@Configuration'
function TestProfiled2Configuration() {

    '@Bean("ProfileTestBean")'
    this.getProfileTestBean = function() {
        return 2;
    }
}