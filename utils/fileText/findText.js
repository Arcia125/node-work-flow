module.exports = (str, text, { invert, onlyMatching } = {}, opts = `gi`) => {
    const regx = new RegExp(`(${text})`, opts);
    const returnVal = onlyMatching ? str.match(regx).join(``) : str;
    if (invert) {
        // console.log(str.match(regx));
        return str.match(regx) === null || (returnVal === ``) ? returnVal : null;
    }
    return str.match(regx) !== null ? returnVal : null;
};
