// @flow
import type { Config } from "./config";

const http = require("http");
const chalk = require("chalk");
const createServer = require("fs-remote/createServer");
const showSpinnerForPromise = require("./showSpinnerForPromise");
const makeClientBundle = require("./makeClientBundle");
const serveJs = require("./serveJs");
const indexHtmlTemplate = require("./indexHtmlTemplate");

async function main(config: Config) {
  const clientCode = await showSpinnerForPromise(
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
    serveJs({
      jsString: clientCode,
      indexHtmlString: indexHtmlTemplate(config.httpPort)
    })
  );
  await showSpinnerForPromise(
    "Starting HTTP server...",
    "Started HTTP server",
    new Promise(resolve => {
      fileServer.listen(config.httpPort, resolve);
    })
  );

  console.log(chalk`
{green require-browser server is up and running!}

require-browser gives you a global {magenta require} function that loads files on your computer.

To test it:

1. Open {blue http://localhost:${config.httpPort}/} in your browser
2. Open your browser's DevTools console
3. Use the global {magenta require} function to load a file:

{magenta require}({yellow "./file.js"});

To use require-browser in your own app, add the following script tag to your page:

<{blue script src}={yellow "http://localhost:${
    config.httpPort
  }/require-browser.js"}></{blue script}>
`);
}

function mainWithErrorHandling(config: Config) {
  return main(config).catch(err => {
    console.error(chalk.red(err.stack));
    process.exit(1);
  });
}

module.exports = mainWithErrorHandling;
