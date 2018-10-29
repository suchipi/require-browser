const path = require("path");

module.exports = {
  mode: "development",
  entry: "./client.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "require-browser.js",
    libraryTarget: "umd"
  },
  resolve: {
    alias: {
      fs: path.resolve(__dirname, "fs.shim.js")
    }
  }
};
