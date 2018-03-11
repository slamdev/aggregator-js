const marshal = data => new Promise((resolve, reject) => {
    try {
        resolve(JSON.stringify(data));
    } catch (e) {
        reject(e);
    }
});

module.exports = (writer, metrics) => marshal(metrics)
    .then(data => writer.write(data));
