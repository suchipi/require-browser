// @flow
const chalk = require("chalk");
const main = require("./main");
const parseArgv = require("./config");
const argv = require("./argv");

const config = parseArgv(argv);

main(config).catch(err => {
  console.error(chalk.red(err.stack));
  process.exit(1);
});
