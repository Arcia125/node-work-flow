const baseChalk = require("chalk");
const ProgessBar = require("progress");
const fs = require("fs");
const glob = require("glob");
const async = require("async");

const { getFileText, getLines, findText } = require("../utils/fileText");

const log = console.log;


module.exports = (program) => {
    program
        .command("find <text> [file]")
        .alias("f")
        .description("find <text> in [file]")
        .option("-L, --lines", "prints line of each line containing <text> (default output)")
        .option("-I, --if", "prints whether <text> was found in [file]")
        .option("-N, --numbers", "prints line number of each line containing <text> (default output)")
        .option("-n, --number-array", "prints the line numbers as an array")
        .option("-F, --file-name", "prints the name of [file]")
        .option("-f, --no-filename", "removes file names from output")
        .option("-v, --invert-match", "inverts search selection")
        .option("-c, --no-colors", "removes colors from output")
        .option("-o, --only-matching", "returns only the part of each line matching <text>")
        .action((text, fileName = "index.js", options) => {
            const fileList = glob(fileName, { nodir: true }, (err, files) => {
                if (err) {
                    console.log(`Error occured while creating glob pattern: ${err}`);
                }
                async.forEachLimit(files, 2000, (file) => {
                    // toggles colors with the flag -c, --only-matching
                    const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });
                    getFileText(file)
                        .then((textData) => {
                            const lines = getLines(textData);
                            const foundTextResult = lines.reduce((a, b) => a.concat(findText(b, text, { invert: options.invertMatch, onlyMatching: options.onlyMatching })), []);
                            const numberedLines = foundTextResult.map((line, lineNumber) => ({ lineNumber, line }));
                            const foundText = numberedLines.filter(lineObj => lineObj.line !== null);
                            const noOutputOpts = !(options.if || options.numberArray || options.numbers || options.lines);
                            const textWasFound = foundText.find(line => line.line.length > 0);

                            if (!textWasFound && !options.if) {
                                return false;
                            }

                            (options.filename && (textWasFound || options.if)) && log(`\n${chalk.bgMagenta(file)}`);

                            !options.filename && log(`\n`);

                            options.if && log(foundText.length > 0 ? chalk.bold.green(true) : chalk.bold.red(false));

                            options.numberArray && textWasFound && log(foundText.map(line => line.lineNumber));


                            ((options.numbers || options.lines) || noOutputOpts)
                            && foundText.forEach((line) => {
                                const spaceCount = 5 - line.lineNumber.toString().length;
                                const lineNumberText = options.numbers || noOutputOpts ? `${line.lineNumber}${' '.repeat(spaceCount > 0 ? spaceCount : 1)}` : ``;
                                const lineText = options.lines || noOutputOpts ? `${line.line}` : ``;
                                log(`${lineNumberText}${chalk.yellow(lineText)}`);
                            });
                        })
                        .catch(error => log(`There was an error getting the file text: ${error}`));
                });
            });
        });
    return program;
};
