// @flow
const { Module } = require("commonjs-standalone");
const delegate = require("./delegate");

const cache = {};
const mod = new Module(__SERVER_CONFIG__.rootModuleId, delegate, cache);

window.require = mod.env().require;

window.global = window;

window.process = {
  cwd() {
    return __SERVER_CONFIG__.rootDir;
  },
  platform: __SERVER_CONFIG__.platform,
  env: __SERVER_CONFIG__.env,
  argv: ["node"],
  versions: {
    node: "8.12.0"
  },
  nextTick(callback, ...args) {
    setTimeout(() => {
      callback(...args);
    }, 0);
  }
};
