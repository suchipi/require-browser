// @flow
import type { Config } from "./config";

const path = require("path");
const webpack = require("webpack");
const MemoryFs = require("memory-fs");

module.exports = function makeClientBundle(
  config: Config
): Promise<{ [filename: string]: string }> {
  const compiler = webpack({
    mode: "development",
    entry: path.resolve(__dirname, "..", "client", "index.js"),
    output: {
      path: "/",
      filename: "require-browser.js",
      libraryTarget: "umd"
    },
    resolve: {
      alias: {
        fs: path.resolve(__dirname, "..", "client", "fs.shim.js")
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __SERVER_SETTINGS__: JSON.stringify(config)
      })
    ]
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      const read = filename => stats.compilation.assets[filename].source();
      resolve({
        "require-browser.js": read("require-browser.js")
      });
    });
  });
};
