// @flow
const path = require("path");

export type Config = {
  fsPort: number,
  httpPort: number,
  rootModuleId: string
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

  return { fsPort, httpPort, rootModuleId };
}

module.exports = parseArgv;
