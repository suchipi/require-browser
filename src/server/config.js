// @flow
const path = require("path");

export type Config = {
  fsPort: number,
  httpPort: number,
  rootModuleId: string,
  requireRootDir: string,
  platform: string,
  env: Object
};

function parseArgv(argv: {
  fsPort: number,
  httpPort: number,
  requireRootDir: string
}): Config {
  let { fsPort, httpPort, requireRootDir } = argv;
  requireRootDir = path.isAbsolute(requireRootDir)
    ? requireRootDir
    : path.resolve(process.cwd(), requireRootDir);

  const rootModuleId = path.join(
    requireRootDir,
    "fake-index-for-require-browser.js"
  );

  return {
    fsPort,
    httpPort,
    rootModuleId,
    requireRootDir,
    platform: process.platform,
    env: {
      NODE_ENV: process.env.NODE_ENV || "development"
    }
  };
}

module.exports = parseArgv;
