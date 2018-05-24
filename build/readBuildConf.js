var fs = require("fs");

var file = fs.readFileSync("build/build-conf.json");
console.log(JSON.parse(file)[0].value);