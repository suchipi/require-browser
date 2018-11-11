// @flow
const path = require("path");

export type Config = {|
  fsPort: number,
  httpPort: number,
  rootModuleId: string,
  rootDir: string,
  platform: string,
  env: Object
|};

function parseArgv(argv: {
  fsPort: number,
  httpPort: number,
  rootDir: string
}): Config {
  let { fsPort, httpPort, rootDir } = argv;
  rootDir = path.isAbsolute(rootDir)
    ? rootDir
    : path.resolve(process.cwd(), rootDir);

  const rootModuleId = path.join(rootDir, "fake-index-for-require-browser.js");

  return {
    fsPort,
    httpPort,
    rootModuleId,
    rootDir,
    platform: process.platform,
    env: {
      NODE_ENV: process.env.NODE_ENV || "development"
    }
  };
}

module.exports = parseArgv;
