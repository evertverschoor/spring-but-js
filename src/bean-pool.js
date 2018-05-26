function BeanPool() {

    const 
        pool = {},
        providers = {};

    this.addBean = addBean;
    this.addProvider = addProvider;
    this.getBean = getBean;

    function isValidName(name) {
        return typeof name === 'string';
    }

    function addBean(name, value) {
        name = name.toLowerCase();

        if(isValidName(name)) {
            if(pool[name] == null) {
                pool[name] = value;
            } else {
                throw 'A bean called "' + name + '" already exists!';
            }
        } else {
            throw '"' + name + '" is an invalid bean name!';
        }
    }

    function addProvider(name, providerFunction) {
        name = name.toLowerCase();

        if(isValidName(name)) {
            if(pool[name] == null && providers[name] == null) {
                providers[name] = providerFunction;
            } else {
                throw 'A bean called "' + name + '" already exists!';
            }
        } else {
            throw '"' + name + '" is an invalid bean name!';
        }
    }

    function getBean(name) {
        name = name.toLowerCase();

        if(pool[name] != null) {
            return pool[name];
        } else if(providers[name] != null) {
            pool[name] = providers[name]();
            return pool[name];
        } else {
            throw 'No bean called "' + name + '" exists!';
        }
    }
}

module.exports = BeanPool;