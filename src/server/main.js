// @flow
import type { Config } from "./config";

const http = require("http");
const ora = require("ora");
const chalk = require("chalk");
const createServer = require("fs-remote/createServer");
const makeClientBundle = require("./makeClientBundle");
const serveJs = require("./serveJs");
const indexHtmlTemplate = require("./indexHtmlTemplate");

async function main(config: Config) {
  const clientSpinner = ora("Preparing client bundle...").start();
  let clientCode;
  try {
    clientCode = await makeClientBundle(config);
  } catch (err) {
    clientSpinner.fail();
    throw err;
  }
  clientSpinner.succeed("Prepared client bundle");

  const fsServerSpinner = ora("Starting filesystem server...").start();
  try {
    const fsServer = createServer();

    await new Promise(resolve => {
      fsServer.listen(config.fsPort, resolve);
    });
  } catch (err) {
    fsServerSpinner.fail();
    throw err;
  }
  fsServerSpinner.succeed("Started filesystem server");

  const httpServerSpinner = ora("Starting HTTP server...").start();
  try {
    const fileServer = http.createServer(
      serveJs({
        jsString: clientCode,
        indexHtmlString: indexHtmlTemplate(config.httpPort)
      })
    );

    await new Promise(resolve => {
      fileServer.listen(config.httpPort, resolve);
    });
  } catch (err) {
    httpServerSpinner.fail();
    throw err;
  }
  httpServerSpinner.succeed("Started HTTP server");

  console.log(chalk.green("\nrequire-browser server is up and running!\n"));
  console.log("Add the following script tag to your page:");
  console.log(
    chalk`\n<{blue script src}={yellow "http://localhost:${
      config.httpPort
    }/require-browser.js"}></{blue script}>\n`
  );
  console.log(
    chalk`Then use the new global {magenta require} function to load files on your computer:`
  );
  console.log(chalk`\n{blue require}({yellow "./file.js"});\n`);
  console.log(
    chalk`If you want to test {magenta require} in your browser now without writing an html file and adding a script tag, open your browser to {blue http://localhost:${
      config.httpPort
    }/}`
  );
}

module.exports = main;
