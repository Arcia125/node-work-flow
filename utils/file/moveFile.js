const fs = require("fs");

function copy (source, destination) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    readStream.on("close", () => fs.unlink(oldPath, (err) => err ? reject(err) : resolve()));
    readStream.pipe(writeStream);
  });
}

module.exports = function moveFile (source, destination) {
  return new Promise((resolve, reject) => {
    fs.rename(source, destination, err => {
      if (err) {
        copy(source, destination)
          .then(success => resolve(success))
          .catch(err => reject(err));
      } else {
        resolve();
      }
    })
  })
}