const baseChalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { getPath } = require("../utils/path");


module.exports = (program) => {
  program
    .command("delete <name>")
    .alias("d")
    .alias("del")
    .description("deletes the given file/directory")
    .option("-c, --no-colors", "removes colors from output")
    .action((name, options) => {
      const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });
      const log = console.log;
      const logSuccess = msg => log(chalk.green(msg));
      const pathName = getPath(name);
      promisify(fs.unlink)(pathName)
        .then(() => logSuccess("Successfully deleted file."))
        .catch(err => console.error(err));
    });
  return program;
};
