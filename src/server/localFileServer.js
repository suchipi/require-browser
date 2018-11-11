// @flow
import type { Config } from "./config";
const ecstatic = require("ecstatic");

module.exports = (config: Config) => {
  return ecstatic({
    root: config.rootDir,
    showdir: true
  });
};
