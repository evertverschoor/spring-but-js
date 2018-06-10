'@Configuration'
function Test3Configuration() {

    '@Autowired'
    this.configureStaticContent = function(app, express) {
        app.use(express.static('./integration-test/rest.components/public_html'));
    }
}