const fs = require('fs');

const isFile = file => new Promise((resolve, reject) => {
    fs.lstat(file, (err, stats) => {
        if (err) {
            reject(err);
        } else if (stats.isFile()) {
            resolve(file);
        } else {
            reject(new Error('provided path is not a file'));
        }
    });
});

const fileExists = file => new Promise((resolve, reject) => {
    fs.exists(file, (exists) => {
        if (exists) {
            resolve(file);
        } else {
            reject(new Error('file is not exist'));
        }
    });
});

const getFileArg = () => new Promise((resolve, reject) => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        reject(new Error('path to a file should be provided'));
        return;
    }
    if (args.length > 1) {
        reject(new Error('only one argument is supported'));
        return;
    }
    resolve(args[0]);
});


module.exports = getFileArg().then(fileExists).then(isFile);
