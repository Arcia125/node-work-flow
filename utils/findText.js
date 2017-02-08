module.exports = (str, text, opts = `gi`) => {
    const regx = new RegExp(`(${text})`, opts);
    return str.match(regx) !== null ? str : null;
};
