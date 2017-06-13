const fs = require("fs");

// update compiler stub
require("./index");

let sources = [];
(() => {
  let base = "../tests";
  fs.readdirSync(base).map((entry) => {
    let file = base + "/" + entry;
    let src = fs.readFileSync(file, "utf-8");
    sources.push(file);
  });
})();

let compiler = require("../bin/dist.js");

let final = () => {
  console.log(passed + "/" + max);
};

let max = 0;
sources.map((sauce) => { let mod = require(sauce); max += mod.length; });
max = (max / 2) | 0;
let passed = 0;
let counter = 0;
sources.forEach((sauce) => {
  let mod = require(sauce);
  ((name) => {
    let errors = 0;
    for (let ii = 0; ii < mod.length; ii += 2) {
      let input = mod[ii + 0];
      let expected = mod[ii + 1];
      ((index) => {
        let _import = {
          error: (msg) => { console.log(name + ":" + index + ":", msg); errors++; }, log: () => {}
        };
        compiler(input, _import).then((result) => {
          let out = result.exports.main(2, 2);
          if (String(out) !== String(expected)) {
            console.log(name + ":" + index + ":", out, "=>", expected);
            passed--;
          }
          if (errors > 0) {
            //console.log(errors, "errors in", name);
          } else {
            passed++;
          }
        }).catch((e) => {
          errors++;
        });
      })(ii);
    };
  })(sauce);
});
