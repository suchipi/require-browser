const path = require("path");
const webpack = require("webpack");
const MemoryFs = require("memory-fs");

module.exports = function makeClientBundle({ fsPort }) {
  const compiler = webpack({
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
        __SERVER_SETTINGS__: JSON.stringify({
          rootModuleId: path.join(process.cwd(), "fake-index.js"),
          fsPort
        })
      })
    ]
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      const code = stats.compilation.assets["require-browser.js"].source();
      resolve(code);
    });
  });
};
