const fs = require('fs');

const readFile = file => new Promise((resolve, reject) =>
    fs.readFile(file, null, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    }));

const unmarshal = data => new Promise((resolve, reject) => {
    try {
        resolve(JSON.parse(data));
    } catch (e) {
        reject(e);
    }
});

module.exports = file => readFile(file).then(unmarshal);
