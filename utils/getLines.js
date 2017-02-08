module.exports = (textData) => {
    // returns all the lines of all the chunks
    return [].concat(...textData.map(chunk => chunk.split(`\n`)));
};
