const fs = require("fs");

// update compiler stub
require("./index");

let sources = [];
(() => {
  let base = "../test";
  fs.readdirSync(base).map((entry) => {
    let file = base + "/" + entry;
    let src = fs.readFileSync(file, "utf-8");
    sources.push(file);
  });
})();

let compiler = require("../bin/dist.js");

sources.forEach((name) => {
  let mod = require(name);
  let errors = 0;
  let passed = 0;
  for (let ii = 0; ii < mod.length; ii += 2) {
    let input = mod[ii + 0];
    let expected = mod[ii + 1];
    let index = ii / 2;
    let _import = {
      error: (msg) => { console.log(name + ":" + index + ":", msg); errors++; }, log: () => {}
    };
    try {
      let result = compiler(input, _import, true);
      let out = result.exports.main(2, 2);
      if (String(out) !== String(expected)) {
        console.log(name + ":" + index + ":", out, "=>", expected);
        passed--;
      } else {
        passed++;
      }
    } catch (e) {
      let err = String(e);
      let expect = expected.slice(2, expected.length);
      if (expected.slice(0, 2) === "::") {
        // todo
      } else {
        console.log(name + ":" + index + ":", e);
        errors++;
      }
    };
  };
});
