'@Component'
function HasPrivateVariable() {

    '@IsAlways2'
    let testVariable;

    this.getTestVariable = function() {
        return testVariable;
    }
}