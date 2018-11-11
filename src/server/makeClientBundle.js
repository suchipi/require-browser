// @flow
import type { Config } from "./config";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const MemoryFs = require("memory-fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        fs: path.resolve(__dirname, "..", "client", "fs.shim.js"),
        path: path.resolve(__dirname, "..", "client", "path.shim.js")
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __SERVER_CONFIG__: JSON.stringify(config)
      }),
      new HtmlWebpackPlugin({
        filename: "require-browser-test.html",
        template: path.resolve(
          __dirname,
          "..",
          "..",
          "require-browser-test.html"
        ),
        templateParameters: { port: config.httpPort }
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
        "require-browser.js": read("require-browser.js"),
        "require-browser-test.html": read("require-browser-test.html")
      });
    });
  });
};
