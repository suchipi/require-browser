const path = require("path");
const webpack = require("webpack");
const MemoryFs = require("memory-fs");

module.exports = function makeClientBundle({ fsPort, requireRootDir }) {
  const compiler = webpack({
    mode: "development",
    entry: path.resolve(__dirname, "..", "client", "index.js"),
    output: {
      path: "/",
      filename: "bundle.js",
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
        __SERVER_SETTINGS__: JSON.stringify({
          rootModuleId: path.join(
            requireRootDir,
            "fake-index-for-require-browser.js"
          ),
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
      const code = stats.compilation.assets["bundle.js"].source();
      resolve(code);
    });
  });
};
