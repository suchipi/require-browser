const http = require("http");
const path = require("path");
const os = require("os");
const ecstatic = require("ecstatic");
const createServer = require("fs-remote/createServer");

const fsServer = createServer();
const fileServer = http.createServer(
  ecstatic({
    root: path.resolve(__dirname, "dist")
  })
);

Promise.all([
  new Promise(resolve => {
    fsServer.listen(3001, resolve);
  }),
  new Promise(resolve => {
    fileServer.listen(3002, resolve);
  })
]).then(
  () => {
    console.log(
      "require-browser server is up and running! Add the following script tag to your page:"
    );
    console.log(
      `\n<script src="http://localhost:3002/require-browser.js"></script>\n`
    );
    console.log(
      "Then use the new global `require` function to load a file on your computer:"
    );
    console.log(
      `\nrequire(${JSON.stringify(path.join(os.homedir(), "file.js"))})\n`
    );
  },
  err => {
    console.error(err);
    process.exit(1);
  }
);
