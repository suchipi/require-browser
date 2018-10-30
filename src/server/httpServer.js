// @flow
import type { IncomingMessage, ServerResponse } from "http";

const mime = require("mime-types");
module.exports = (files: { [filename: string]: string }) => (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const requestedFile =
    req.url === "/" ? "index.html" : req.url.replace(/^\//, "");

  if (files[requestedFile] == null) {
    res.writeHead(404);
    res.end("404 Not Found");
    return;
  }

  const contentType = mime.lookup(requestedFile) || "application/octet-stream";
  const data = files[requestedFile];

  res.writeHead(200, { "Content-Type": contentType });
  res.end(data, "utf-8");
};
