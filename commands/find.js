const baseChalk = require(`chalk`);
const ProgessBar = require(`progress`);
const fs = require(`fs`);

const { getFileText, getLines, findText } = require(`../utils/fileText`);

const log = console.log;


module.exports = (program) => {
    program
        .command(`find <text> [file]`)
        .alias(`f`)
        .description(`find <text> in [file]`)
        .option(`-L, --lines`, `prints line of each line containing <text> (default output)`)
        .option(`-I, --if`, `prints whether <text> was found in [file]`)
        .option(`-N, --numbers`, `prints line number of each line containing <text> (default output)`)
        .option(`-n, --number-array`, `prints the line numbers as an array`)
        .option(`-f, --file-name`, `prints the name of [file]`)
        .option(`-v, --invert-match`, `inverts search selection`)
        .option(`-c, --no-colors`, `removes colors from output`)
        .option(`-o, --only-matching`, `returns only the part of each line matching <text>`)
        .action((text, file = `index.js`, options) => {
            // progess bar options
            const fileSize = fs.statSync(file).size;
            const progressOpts = {
                width: 20,
                total: fileSize,
                clear: true,
            };
            // progress bar object creation
            const bar = new ProgessBar(`reading file [:bar] :percent :etas`, progressOpts);

            // toggles colors with the flag -c, --only-matching
            const chalk = new baseChalk.constructor({ enabled: options.noColors || options.colors });

            // callback that will be called by getFileText on every chunk when
            // reading a file
            const onData = (chunk) => {
                bar.tick(chunk.length);
            };

            getFileText(file, onData)
                .then((textData) => {
                    const lines = getLines(textData);
                    const foundTextResult = lines.reduce((a, b) => a.concat(findText(b, text, { invert: options.invertMatch, onlyMatching: options.onlyMatching })), []);
                    const numberedLines = foundTextResult.map((line, lineNumber) => ({ lineNumber, line }));
                    const foundText = numberedLines.filter(lineObj => lineObj.line !== null);
                    const noOutputOpts = !(options.if || options.numberArray || options.numbers || options.lines);

                    options.fileName && log(chalk.black.bgWhite(file));
                    options.if && log(foundText.length > 0 ? chalk.bold.green(true) : chalk.bold.red(false));
                    options.numberArray && log(foundText.map(line => line.lineNumber));
                    ((options.numbers || options.lines) || noOutputOpts) && foundText.forEach((line) => {
                        const spaceCount = 5 - line.lineNumber.toString().length;
                        const lineNumberText = options.numbers || noOutputOpts ? `${line.lineNumber}${' '.repeat(spaceCount > 0 ? spaceCount : 1)}` : ``;
                        const lineText = options.lines || noOutputOpts ? `${line.line}` : ``;
                        log(`${lineNumberText}${lineText}`);
                    });
                })
                .catch(err => log(`There was an error getting the file text: ${err}`));
        });
    return program;
};
