const fs = require("fs");

let bin = "../bin/dist.js";

let sources = [];
(() => {
  let base = "../src";
  fs.readdirSync(base).map((entry) => {
    let file = base + "/" + entry;
    let src = fs.readFileSync(file, "utf-8");
    sources.push(src);
  });
})();

let code = "(function() { \n";
sources.map((src) => {
  code += src;
});
code += "})();";

fs.writeFileSync(bin, code, "utf-8");

// make sure our env is >= v8.x
(() => {
  let version = process.version;
  let split = version.substring(1, version.length).split(".");
  let base = parseInt(split[0]);
  if (base < 8) throw new Error(
    "Unsupported our outdated node version (project requires v8.x)"
  );
})();

try {
  require(bin);
} catch (e) {
  throw new Error(e);
};
