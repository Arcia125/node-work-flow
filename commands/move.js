const baseChalk = require("chalk");
const fs = require("fs");
const { getPath } = require("../utils/path");


module.exports = (program) => {
  program
  .command("move <oldPath> <newPath>")
  .alias("m")
  .description("moves a file from <oldPath> to <newPath>")
  .option("-c, --no-colors", "removes colors from output")
  .option("-v, --copy", "copies file instead of moving")
  .action((oldPath, newPath, options) => {
    const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });
    const log = console.log;
    const logSuccess = msg => log(chalk.green(msg));
    const source = getPath(oldPath);
    const destination = getPath(newPath);
    if (options.copy) {
      const { copyFile } = require("../utils/file");
      copyFile(source, destination)
        .then(success => logSuccess("Sucessfully copied file"))
        .catch(err => console.error(err));
    } else {
      const { moveFile } = require("../utils/file");
      moveFile(source, destination)
        .then(success => logSuccess("Sucessfully moved file"))
        .catch(err => console.error(err));
    }
    });
  return program;
};
