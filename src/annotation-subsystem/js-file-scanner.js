// ------------------------------------------------------------------------ //
//  Copyright © 2018 Evert Verschoor                                        //
//  This work is free. You can redistribute it and/or modify it under the   //
//  terms of the Do What The Fuck You Want To Public License, Version 2,    //
//  as published by Sam Hocevar. See the COPYING file for more details.     //
// ------------------------------------------------------------------------ //

const 
    fs = require('fs'),
    path = require('path');

function JsFileScanner(_logger) {

    const logger = _logger;

    this.getJsContentsInDirectory = getJsContentsInDirectory;

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

    function walkDirectoryAsync(dir, done) {
        let results = [];
    
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
    
            var pending = list.length;
    
            if (!pending) return done(null, results);
    
            list.forEach(function(file){
                file = path.resolve(dir, file);
    
                fs.stat(file, function(err, stat){
                    // If directory, execute a recursive call
                    if (stat && stat.isDirectory()) {
                        // Add directory to array [comment if you need to remove the directories from the array]
                        results.push(file);
    
                        walkDirectoryAsync(file, function(err, res){
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);
    
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    };

    function getJsContentsInDirectory(path) {
        return new Promise((resolve, reject) => {
            walkDirectoryAsync(path, (err, files) => {
                if(err) {
                    logger.error(err);
                } else {
                    let parsedFiles = 0,
                        returnValue = [];

                    files = files.filter(f => isJsFile(f));
                    files.forEach(file => {
                        readFile(file).then(f => {
                            checkSyntax(f);

                            returnValue.push(f.toString());

                            parsedFiles++;
                            if(parsedFiles >= files.length) {
                                resolve(returnValue);
                            }
                        }).catch(err => {
                            logger.error(err);

                            parsedFiles++;
                            if(parsedFiles >= files.length) {
                                resolve(returnValue);
                            }
                        });
                    });
                }
            });
        });
    }
}

module.exports = JsFileScanner;