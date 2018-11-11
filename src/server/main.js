// @flow
import type { Config } from "./config";

const http = require("http");
const chalk = require("chalk");
const createServer = require("fs-remote/createServer");
const showSpinnerForPromise = require("./showSpinnerForPromise");
const makeClientBundle = require("./makeClientBundle");
const internalFileServer = require("./internalFileServer");
const localFileServer = require("./localFileServer");

async function main(config: Config) {
  const clientBundle = await showSpinnerForPromise(
    "Preparing client bundle...",
    "Prepared client bundle",
    makeClientBundle(config)
  );

  const fsServer = createServer();
  await showSpinnerForPromise(
    "Starting filesystem server...",
    "Started filesystem server",
    new Promise(resolve => {
      fsServer.listen(config.fsPort, resolve);
    })
  );

  const fileServer = http.createServer(
    internalFileServer(clientBundle, localFileServer(config))
  );
  await showSpinnerForPromise(
    "Starting HTTP server...",
    "Started HTTP server",
    new Promise(resolve => {
      fileServer.listen(config.httpPort, resolve);
    })
  );

  // prettier-ignore
  console.log(chalk`
{green require-browser server is up and running!}

require-browser gives your browser a global {magenta require} function that loads files on your computer.
It behaves the same as the {magenta require} function from Node.js.

To test it:

1. Open {blue http://localhost:${config.httpPort}/require-browser-test.html} in your browser
2. Open your browser's DevTools console
3. Use the global {magenta require} function to load a file:

{magenta require}({yellow "./file.js"});

To use require-browser in your own app:

1. Create an {yellow index.html} in {yellow ${config.rootDir === process.cwd() ? "this directory" : config.rootDir}}
2. Add the following script tag to your index.html:

<{blue script src}={yellow "http://localhost:${config.httpPort}/require-browser.js"}></{blue script}>

3. Add a script tag for your own JavaScript code, where you can now use the {magenta require} function.

{red require-browser is for development use only!
Do not use this tool on user-facing websites; it isn't secure!}
`);
}

function mainWithErrorHandling(config: Config) {
  return main(config).catch(err => {
    console.error(chalk.red(err.stack));
    process.exit(1);
  });
}

module.exports = mainWithErrorHandling;
