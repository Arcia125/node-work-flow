#!/usr/bin/env node

const program = require("commander");
const pkgJson = require("./package.json");
const execCmd = require("child_process").exec;

program
    .version(pkgJson.version);

// commands
require("./commands/find")(program);
require("./commands/create")(program);
require("./commands/write")(program);
require("./commands/move")(program);

program
    .command("help [cmd]")
    .description("provides help for [cmd]")
    .action((cmd) => cmd ? execCmd(`nwf ${cmd} -h`, (err, stdout, stderr) => {
        if (err) {
            throw err;
        }
        return console.log(stdout);
    }) : program.help());

program.parse(process.argv);

if (!program.args.length) program.help();
