const fs = require("fs");

module.exports = function copyFile (source, target) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(target);
    readStream.on("error", err => reject(err));
    writeStream.on("error", err => reject(err));
    writeStream.on("clone", success => resolve(success));
    readStream.pipe(writeStream);
  });
}