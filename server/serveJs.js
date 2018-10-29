module.exports = jsString => (req, res) => {
  if (req.url === "/require-browser.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(jsString, "utf-8");
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
};
