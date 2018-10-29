// weird variable namespace because eval has access to all variables in its parent scopes :\
// we shadow this one out though
const __internals__ = {
  path: require("path"),
  resolve: require("resolve"),
  fs: require("fs")
};

__internals__.delegate = {
  resolve(id, fromFilePath) {
    if (__internals__.path.isAbsolute(id)) {
      return id;
    }

    return __internals__.resolve.sync(id, {
      basedir: __internals__.path.dirname(fromFilePath),
      preserveSymlinks: false,
      readFile: __internals__.fs.readFileSync,
      readFileSync: __internals__.fs.readFileSync,
      isFile: function isFile(file) {
        try {
          var stat = __internals__.fs.statSync(file);
        } catch (e) {
          if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
          throw e;
        }
        return stat.isFile() || stat.isFIFO();
      }
    });
  },

  read(filepath) {
    return __internals__.fs.readFileSync(filepath, "utf-8");
  },

  run(/* code, moduleEnv, filepath */) {
    if (arguments[2].match(/\.json$/)) {
      arguments[1].module.exports = JSON.parse(arguments[0]);
      return;
    }

    eval(
      "(function (exports, require, module, __filename, __dirname, __internals__) { " +
        arguments[0] +
        "\n})" +
        "\n//# sourceURL=file://" +
        arguments[2]
    )(
      arguments[1].exports,
      arguments[1].require,
      arguments[1].module,
      arguments[1].__filename,
      arguments[1].__dirname,
      undefined // shadow __internals__
    );
  }
};

module.exports = __internals__.delegate;
