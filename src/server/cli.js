// @flow
const main = require("./main");
const parseArgv = require("./config");
const argv = require("./argv");

const config = parseArgv(argv);

main(config);
