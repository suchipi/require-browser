const path = require("path-browserify");
const dirname = require("./dirname");

module.exports = Object.assign({}, path, { dirname });
