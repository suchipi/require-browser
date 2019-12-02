// @flow
const { Module } = require("commonjs-standalone");
const delegate = require("./delegate");

const cache = {};
const mod = new Module(__SERVER_CONFIG__.rootModuleId, delegate, cache);

window.require = mod.env().require;

window.global = window;

const stream = require("stream");
const stdout = new stream.Writable();
// $FlowFixMe
stdout._write = function _write(chunk, encoding, callback) {
  console.log(chunk);
  callback();
};

const stderr = new stream.Readable();
// $FlowFixMe
stderr.isTTY = false;

window.process = {
  cwd() {
    return __SERVER_CONFIG__.rootDir;
  },
  platform: __SERVER_CONFIG__.platform,
  env: __SERVER_CONFIG__.env,
  argv: ["node"],
  version: "8.12.0",
  versions: {
    node: "8.12.0"
  },
  nextTick(callback, ...args) {
    setTimeout(function() {
      callback(...args);
    }, 0);
  },
  stdout: stdout,
  stderr: stderr
};
