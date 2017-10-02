const baseChalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { getPath } = require("../utils/path");


const stripTrailingNewLines = str => str.replace(/(\n|\r)+$/, "");

const SENTINELS = ["quit", "q"];

module.exports = (program) => {
  program
    .command("write <name> [text]")
    .alias("w")
    .description("writes the given [text] to the file with the given <name>")
    .option("-c, --no-colors", "removes colors from output")
    .option("-i, --interactive", "allows interactive input mode")
    .action((name, text = "", options) => {
      const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });
      const log = console.log;
      const logSuccess = msg => log(chalk.green(msg));
      const pathName = getPath(name);
      const writeStream = fs.createWriteStream(pathName, { flags: "a" });
      if (options.interactive) {
        writeStream.once("open", fileDescriptor => {
          process.stdin.resume();
          process.stdin.setEncoding("utf8");
          process.stdin.on("data", userInput => {
            const strippedInput = stripTrailingNewLines(userInput);
            if (SENTINELS.includes(strippedInput.toLowerCase())) {
              writeStream.end();
              process.stdin.pause();
              return;
            }
            writeStream.write(userInput);
          })
        })
      } else {
        writeStream.once("open", fileDescriptor => {
          writeStream.write(`\n${text}`);
          logSuccess("Sucessfully wrote to file!");
          writeStream.end();
        });
      }
    });
  return program;
};
