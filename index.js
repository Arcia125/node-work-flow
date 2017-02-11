#!/usr/bin/env node

const program = require(`commander`);
const chalk = require(`chalk`);
const ProgessBar = require(`progress`);
const pkgJson = require(`./package.json`);
const execCmd = require(`child_process`).exec;

program
    .version(pkgJson.version);

// commands
require(`./commands/find`)(program);


program
    .command(`help [cmd]`)
    .description(`provides help for [cmd]`)
    .action(cmd => cmd ? execCmd(`nwf ${cmd} -h`, (err, stdout, stderr) => console.log(stdout)) : program.help());

program.parse(process.argv);

if (!program.args.length) program.help();
