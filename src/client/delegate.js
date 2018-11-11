// @flow
import type { Delegate } from "commonjs-standalone";

// weird variable namespace because eval has access to all variables in its parent scopes :\
// we shadow this one out though, so it's safe to put stuff in here
const __vars__: Object = {
  path: require("path"),
  resolve: require("resolve"),
  fs: require("fs"),
  loggedWarnings: {},
  logWarning(moduleName) {
    if (!__vars__.loggedWarnings[moduleName]) {
      console.warn(
        `Providing a shim implementation for ${JSON.stringify(
          moduleName
        )}. Some functionality may not be present.`
      );
    }
    __vars__.loggedWarnings[moduleName] = true;
  }
};

__vars__.builtins = {
  fs: __vars__.fs,
  path: __vars__.path,
  assert: require("assert"),
  buffer: require("buffer"),
  // $FlowFixMe
  constants: require("constants"),
  crypto: require("crypto"),
  domain: require("domain"),
  events: require("events"),
  http: require("http"),
  https: require("https"),
  os: require("os"),
  punycode: require("punycode"),
  process: require("process"),
  querystring: require("querystring"),
  stream: require("stream"),
  // $FlowFixMe
  _stream_duplex: require("_stream_duplex"),
  // $FlowFixMe
  _stream_passthrough: require("_stream_passthrough"),
  // $FlowFixMe
  _stream_readable: require("_stream_readable"),
  // $FlowFixMe
  _stream_transform: require("_stream_transform"),
  // $FlowFixMe
  _stream_writable: require("_stream_writable"),
  string_decoder: require("string_decoder"),
  // $FlowFixMe
  sys: require("sys"),
  // $FlowFixMe
  timers: require("timers"),
  tty: require("tty"),
  url: require("url"),
  util: require("util"),
  vm: require("vm"),
  zlib: require("zlib")
};

__vars__.delegate = ({
  resolve(id, fromFilePath) {
    // Handle builtins
    if (__vars__.builtins[id]) {
      if (id !== "fs" && id !== "path") {
        __vars__.logWarning(id);
      }
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
    return __vars__.fs.readFileSync(filepath, "utf-8");
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
