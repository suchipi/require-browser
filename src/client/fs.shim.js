const createClient = require("fs-remote/createClient");

module.exports = createClient("http://localhost:" + __SERVER_CONFIG__.fsPort);
