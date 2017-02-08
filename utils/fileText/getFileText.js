const fs = require(`fs`);

module.exports = (file, cb) => new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(file);
    fileStream.setEncoding(`utf8`);
    const fileText = [];
    fileStream.on(`data`, (chunk) => {
        if (typeof cb === `function`) {
            cb(chunk);
        }
        fileText.push(chunk);
    });
    fileStream.on(`end`, () => {
        resolve(fileText);
    });
});
