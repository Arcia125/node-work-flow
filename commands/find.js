const chalk = require(`chalk`);
const ProgessBar = require(`progress`);
const fs = require(`fs`);

const getFileText = require(`../utils/getFileText`);
const getLines = require(`../utils/getLines`);
const findText = require(`../utils/findText`);

module.exports = (program) => {
    program
        .command(`find <text> [file]`)
        .description(`find <text> in [file]`)
        .option(`-I, --if`, `prints whether <text> was found in [file]`)
        .option(`-N, --numbers`, `prints line number of each line containing <text>`)
        .option(`-L, --lines`, `prints line of each line containing <text>`)
        .action((text, file = `index.js`, options) => {
            console.log(file);
            // progess bar options
            const fileSize = fs.statSync(file).size;
            const progressOpts = {
                width: 20,
                total: fileSize,
                clear: true,
            };
            // progress bar object creation
            const bar = new ProgessBar(`reading file [:bar] :percent :etas`, progressOpts);

            // callback that will be called by getFileText on every chunk when
            // reading a file
            const onData = (chunk) => {
                bar.tick(chunk.length);
            };

            getFileText(file, onData)
                .then((textData) => {
                    const lines = getLines(textData);
                    const foundTextResult = lines.reduce((a, b) => a.concat(findText(b, text)), []);
                    const numberedLines = foundTextResult.map((line, lineNumber) => ({ lineNumber, line }));
                    const foundText = numberedLines.filter(lineObj => lineObj.line !== null);

                    if (options.if) {
                        console.log(foundText.length > 0 ? chalk.bold.green(true) : chalk.bold.red(false));
                    }
                    if (options.numbers || options.lines) {

                        foundText.forEach(line => {
                            const lineNumberText = options.numbers ? `${line.lineNumber} ` : '';
                            const lineText = options.lines ? `${line.line}` : '';
                            console.log(`${lineNumberText}${lineText}`);
                        });
                    }
                    // console.log(lines);
                    // console.log(foundText);
                })
                .catch(err => console.log(`There was an error getting the file text: ${err}`));
        });
    return program;
};
