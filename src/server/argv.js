// @flow
const path = require("path");
const argv: {
  fsPort: number,
  httpPort: number,
  requireRootDir: string
} = require("yargs")
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
  .option("require-root-dir", {
    demandOption: true,
    default: ".",
    describe:
      "Directory for the global require function to resolve relative to",
    type: "string"
  }).argv;

let { fsPort, httpPort, requireRootDir } = argv;
requireRootDir = path.isAbsolute(requireRootDir)
  ? requireRootDir
  : path.resolve(process.cwd(), requireRootDir);

module.exports = { fsPort, httpPort, requireRootDir };
