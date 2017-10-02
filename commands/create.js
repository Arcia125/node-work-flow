const baseChalk = require(`chalk`);
const fs = require(`fs`);
const path = require("path");
const { promisify } = require("util");
const { getPath } = require("../utils/path");

const writeFileAsync = promisify(fs.writeFile);

module.exports = (program) => {
  program
  .command(`create <name> [text]`)
  .alias(`c`)
  .description(`creates a file/directory with the given <name> and [text]`)
  // .option(`-L, --lines`, `prints line of each line containing <text> (default output)`)
  .option("-d, --dir", "creates a directory with the given <name>")
  .option(`-c, --no-colors`, `removes colors from output`)
  .action((name, text = ``, options) => {
    const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });
    const log = console.log;
    const logSuccess = msg => log(chalk.green(msg));
    if (options.dir) {
      const pathName = name;
      const makeDir = require("make-dir");
      makeDir(pathName)
        .then(success => logSuccess("Directory successfully created"))
        .catch(err => {
          console.error("An error occured while trying to create your directory", err);
        })
    } else {
      const pathName = getPath(name);
      writeFileAsync(pathName, text)
        .then(() => logSuccess("File sucessfully created"))
        .catch(err => console.error("An error occured while trying to create your file: ", err));
    }
    });
  return program;
};
