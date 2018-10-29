const { Module } = require("commonjs-standalone");
const delegate = require("./delegate");

const cache = {};
const mod = new Module(".", delegate, cache);

window.require = mod.env().require;
window.global = window;
