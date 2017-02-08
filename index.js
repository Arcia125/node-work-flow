#!/usr/bin/env node

const program = require(`commander`);
const chalk = require(`chalk`);
const ProgessBar = require(`progress`);
const pkgJson = require(`./package.json`);

program
    .version(pkgJson.version);

// commands
require(`./commands/find`)(program);

program.parse(process.argv);

if (!program.args.length) program.help();
