function BeanPool(logger) {

    const 
        pool = {},
        providers = {};

    this.addBean = addBean;
    this.addProvider = addProvider;
    this.getBean = getBean;
    this.beanExists = beanExists;
    this.waitForBean = waitForBean;

    function isValidName(name) {
        return typeof name === 'string';
    }

    function addBean(name, value) {
        name = name.toLowerCase();

        if(isValidName(name)) {
            if(pool[name] == null) {
                pool[name] = value;
            } else {
                logger.error('A bean called "' + name + '" already exists!');
            }
        } else {
            logger.error('"' + name + '" is an invalid bean name!');
        }
    }

    function addProvider(name, providerFunction) {
        name = name.toLowerCase();

        if(isValidName(name)) {
            if(pool[name] == null && providers[name] == null) {
                providers[name] = providerFunction;
            } else {
                logger.error('A bean called "' + name + '" already exists!');
            }
        } else {
            logger.error('"' + name + '" is an invalid bean name!');
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
            logger.error('No bean called "' + name + '" exists!');
        }
    }

    function beanExists(name) {
        name = name.toLowerCase();

        if(pool[name] != null) {
            return true;
        } else if(providers[name] != null) {
            return true;
        } else {
            return false;
        }
    }

    function waitForBean(name, callback) {
        let maxTries = 10,
            currentTries = 0;

        const checker = setInterval(() => {
            if(currentTries >= maxTries) {
                logger.warn('Timed out waiting for bean: "' + name + '"!');
                clearInterval(checker);
            } else if(beanExists(name)) {
                callback(getBean(name));
                clearInterval(checker);
            } else {
                currentTries++;
            }
        }, 5);
    }
}

module.exports = BeanPool;