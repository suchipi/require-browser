// @flow
import type { Delegate } from "commonjs-standalone";

// weird variable namespace because eval has access to all variables in its parent scopes :\
// we shadow this one out though, so it's safe to put stuff in here
const __vars__: Object = {
  path: require("path"),
  resolve: require("resolve"),
  fs: require("fs"),
  nodeLibsBrowser: require("node-libs-browser")
};

__vars__.builtins = {
  fs: __vars__.fs
};

__vars__.delegate = ({
  resolve(id, fromFilePath) {
    // Handle builtins
    if (__vars__.builtins[id]) {
      return id;
    }

    // Handle real files via node resolution algorithm
    return __vars__.resolve.sync(id, {
      basedir: __vars__.path.dirname(fromFilePath),
      preserveSymlinks: false,
      readFile: __vars__.fs.readFileSync,
      readFileSync: __vars__.fs.readFileSync,
      isFile: function isFile(file) {
        try {
          var stat = __vars__.fs.statSync(file);
        } catch (e) {
          if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
          throw e;
        }
        return stat.isFile() || stat.isFIFO();
      }
    });
  },

  read(filepath) {
    // Handle builtins
    if (__vars__.builtins[filepath]) {
      return ""; // Not used
    }

    // Handle real files
    try {
      return __vars__.fs.readFileSync(filepath, "utf-8");
    } catch (err) {
      // Try loading a file via a node-libs-browser shim
      const shimPath = __vars__.nodeLibsBrowser[filepath];
      if (shimPath) {
        console.warn(
          `Providing a shim implementation for ${JSON.stringify(
            filepath
          )}. Some functionality may not be present.`
        );
        return __vars__.delegate.read(shimPath);
      } else {
        throw err;
      }
    }
  },

  run(/* code, moduleEnv, filepath */) {
    // Handle builtins
    if (__vars__.builtins[arguments[2]]) {
      arguments[1].module.exports = __vars__.builtins[arguments[2]];
      return;
    }

    // Handle *.json
    if (arguments[2].match(/\.json$/)) {
      arguments[1].module.exports = JSON.parse(arguments[0]);
      return;
    }

    // Handle *.js
    eval(
      "(function (exports, require, module, __filename, __dirname, __vars__) { " +
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
      undefined // shadow __vars__
    );
  }
}: Delegate);

module.exports = __vars__.delegate;
