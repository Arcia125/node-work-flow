const path = require("path");

module.exports = pathName => path.isAbsolute(pathName) ? pathName : path.resolve(process.cwd(), pathName);
