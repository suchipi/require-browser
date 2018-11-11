const json = require("./data.json");

const pre = document.createElement("pre");
pre.textContent = JSON.stringify(json, null, 2);

document.body.appendChild(pre);
