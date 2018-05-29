const fs = require('fs');

function ComponentScanner(_parser, _logger) {

    const
        parser = _parser,
        logger = _logger;

    this.scanDirectory = scanDirectory;

    function readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        
    }

    function checkSyntax(filename, functionAsString) {
        try {
            new Function(functionAsString);
        } catch(err) {
            logger.error('The file "' + filename + '" has some invalid syntax!\n\n' + err);
        }
    }

    function isJsFile(file) {
        return file.split('').reverse().join('').indexOf('sj.') == 0;
    }

    function scanDirectory(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                let parsedFiles = 0;

                files.filter(f => isJsFile(f)).forEach(file => {
                    readFile(path + '/' + file).then(f => {
                        checkSyntax(f);
                        parser.parse(f.toString());

                        parsedFiles++;
                        if(parsedFiles >= files.length) {
                            resolve();
                        }
                    }).catch(err => {
                        logger.error(err);

                        parsedFiles++;
                        if(parsedFiles >= files.length) {
                            resolve();
                        }
                    });
                });
            });
        });
    }
}

module.exports = ComponentScanner;