module.exports = (str, text, { invert, onlyMatching } = {}, opts = `gi`) => {
    const regx = new RegExp(`(${text})`, opts);
    const matches = str.match(regx);
    const returnVal = onlyMatching ? (matches ? matches.join(``) : str) : str;
    if (invert) {
        // console.log(matches);
        return matches === null || (returnVal === ``) ? returnVal : null;
    }
    return matches !== null ? returnVal : null;
};
