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
  fs: function() {
    return __vars__.fs;
  },
  path: function() {
    return __vars__.path;
  },
  assert: function() {
    return require("assert");
  },
  buffer: function() {
    return require("buffer");
  },
  constants: function() {
    // $FlowFixMe
    return require("constants");
  },
  crypto: function() {
    return require("crypto");
  },
  domain: function() {
    return require("domain");
  },
  events: function() {
    return require("events");
  },
  http: function() {
    return require("http");
  },
  https: function() {
    return require("https");
  },
  os: function() {
    return require("os");
  },
  punycode: function() {
    return require("punycode");
  },
  process: function() {
    return window.process;
  },
  querystring: function() {
    return require("querystring");
  },
  stream: function() {
    return require("stream");
  },
  _stream_duplex: function() {
    // $FlowFixMe
    return require("_stream_duplex");
  },
  _stream_passthrough: function() {
    // $FlowFixMe
    return require("_stream_passthrough");
  },
  _stream_readable: function() {
    // $FlowFixMe
    return require("_stream_readable");
  },
  _stream_transform: function() {
    // $FlowFixMe
    return require("_stream_transform");
  },
  _stream_writable: function() {
    // $FlowFixMe
    return require("_stream_writable");
  },
  string_decoder: function() {
    return require("string_decoder");
  },
  sys: function() {
    // $FlowFixMe
    return require("sys");
  },
  timers: function() {
    // $FlowFixMe
    return require("timers");
  },
  tty: function() {
    return require("tty");
  },
  url: function() {
    return require("url");
  },
  util: function() {
    return require("util");
  },
  vm: function() {
    return require("vm");
  },
  zlib: function() {
    return require("zlib");
  }
};

// require('module').builtinModules
[
  "async_hooks",
  "assert",
  "buffer",
  "child_process",
  "console",
  "constants",
  "crypto",
  "cluster",
  "dgram",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "_http_agent",
  "_http_client",
  "_http_common",
  "_http_incoming",
  "_http_outgoing",
  "_http_server",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "_stream_readable",
  "_stream_writable",
  "_stream_duplex",
  "_stream_transform",
  "_stream_passthrough",
  "_stream_wrap",
  "string_decoder",
  "sys",
  "timers",
  "tls",
  "_tls_common",
  "_tls_wrap",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "zlib",
  "v8/tools/splaytree",
  "v8/tools/codemap",
  "v8/tools/consarray",
  "v8/tools/csvparser",
  "v8/tools/profile",
  "v8/tools/profile_view",
  "v8/tools/logreader",
  "v8/tools/arguments",
  "v8/tools/tickprocessor",
  "v8/tools/SourceMap",
  "v8/tools/tickprocessor-driver",
  "node-inspect/lib/_inspect",
  "node-inspect/lib/internal/inspect_client",
  "node-inspect/lib/internal/inspect_repl"
].forEach(function(key) {
  if (!__vars__.builtins[key]) {
    __vars__.builtins[key] = function() {
      return {};
    };
  }
});

__vars__.delegate = ({
  resolve: function resolve(id, fromFilePath) {
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

  read: function read(filepath) {
    // Handle builtins
    if (__vars__.builtins[filepath]) {
      return ""; // Not used
    }

    // Handle real files
    return __vars__.fs.readFileSync(filepath, "utf-8");
  },

  run: function run(/* code, moduleEnv, filepath */) {
    // Handle builtins
    if (__vars__.builtins[arguments[2]]) {
      arguments[1].module.exports = __vars__.builtins[arguments[2]]();
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
