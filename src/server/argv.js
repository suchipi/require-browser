// @flow
module.exports = require("yargs")
  .option("fs-port", {
    demandOption: true,
    default: 3001,
    describe: "Port to run the fs-remote server on",
    type: "number"
  })
  .option("http-port", {
    demandOption: true,
    default: 3002,
    describe: "Port to host the require-browser.js file from",
    type: "number"
  })
  .option("root-dir", {
    demandOption: true,
    default: ".",
    describe:
      "Directory where index.html can be found and the global require function will resolve relative to",
    type: "string"
  }).argv;
