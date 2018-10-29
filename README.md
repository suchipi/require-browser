# `require-browser`

The `require-browser` package gives you an easy-to-use `require` function for your browser that behaves the same as the one in [Node.js](https://nodejs.org/).

## Features

- Works without installation via `npx`
- Makes it easy to get started developing with modules now
- Works on Windows, Linux, and macOS
- Can later be replaced with [Webpack](https://webpack.js.org/) or [browserify](http://browserify.org/) with few or no code changes
- `require("fs")` works the same as in Node (via [`fs-remote`](https://www.npmjs.com/package/fs-remote))
- `require("os")`, `require("buffer")`, and other Node builtin modules will be automatically replaced with browser-compatible shims

`require-browser` is not suitable for use in production, but makes it easy to get started developing in the browser. Once you want to run your code in production, I suggest using [Webpack](https://webpack.js.org/) to bundle your application.

## Usage

You must have [Node.js](https://nodejs.org/) 8.12.0 or higher installed, then run the following in your terminal or command prompt to test it:

```
npx require-browser
```

A server will start and further instructions will be printed in your terminal/command prompt.

## Installation

If you want to install `require-browser` globally so you don't need to download it with `npx` each time you run it, run the following in your terminal or command prompt:

```
npm install -g require-browser
```

Then you can run it without npx:

```
require-browser
```

## CLI Options

```
$ require-browser --help
Options:
  --help              Show help                                        [boolean]
  --version           Show version number                              [boolean]
  --fs-port           Port to run the fs-remote server on
                                             [number] [required] [default: 3001]
  --http-port         Port to host the require-browser.js file from
                                             [number] [required] [default: 3002]
  --require-root-dir  Directory for the global require function to resolve
                      relative to             [string] [required] [default: "."]
```

## License

MIT
