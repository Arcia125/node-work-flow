const baseChalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

module.exports = (program) => {
  program
    .command("request <url>")
    .alias("r")
    .alias("req")
    .description("performs a network request to the given <url>")
    .option("-c, --no-colors", "removes colors from output")
    .option("-m, --method <type>", "sets request method")
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
