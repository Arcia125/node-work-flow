const baseChalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const axios = require("axios");

module.exports = (program) => {
  program
    .command("request <url>")
    .alias("r")
    .alias("req")
    .description("performs a network request to the given <url>")
    .option("-c, --no-colors", "removes colors from output")
    .option("-X, --method <type>", "sets request method")
    .option("-H, --headers <headers>")
    .option("-d, --data <data>")
    .action((url, options) => {
      const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });
      const log = console.log;
      const logSuccess = msg => log(chalk.green(msg));
      const method = options.method || "get";
      const headers = options.headers ? JSON.parse(options.headers) : null;
      const data = options.data ? JSON.parse(options.data) : null;
      axios({
        method,
        url,
        headers,
        data,
      })
        .then(response => {
          logSuccess("Request successful!");
          if (response.data) {
            log(response.data);
          }
        })
        .catch(err => console.error(err));
    });
  return program;
};
