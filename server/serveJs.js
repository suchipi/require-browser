module.exports = ({ jsString, indexHtmlString }) => (req, res) => {
  if (req.url === "/require-browser.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(jsString, "utf-8");
  } else if (req.url === "/index.html" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(indexHtmlString, "utf-8");
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
};
