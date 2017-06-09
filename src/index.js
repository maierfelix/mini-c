"use strict";

// # compiler globals
let bytes = null;
let scope = null;
let pindex = 0;
let tokens = null;
let current = null;
let findex = 0;
let __imports = null;

function hexDump(array) {
  let result = Array.from(array).map((v) => {
    return (v.toString(16));
  });
  return (result);
};

function compile(str, imports) {
  // reset
  findex = pindex = 0;
  scope = current = __imports = tokens = null;
  bytes = new ByteArray();
  __imports = imports;
  currentHeapOffset = 3;

  let tkns = scan(str);
  let ast = parse(tkns);
  //console.log(ast);
  emit(ast);
  let buffer = new Uint8Array(bytes);
  let dump = hexDump(buffer);
  return new Promise((resolve, reject) => {
    WebAssembly.instantiate(buffer).then((result) => {
      let instance = result.instance;
      let output = {
        ast: ast,
        dump: dump,
        buffer: buffer,
        memory: instance.exports.memory,
        instance: instance,
        exports: instance.exports
      };
      resolve(output);
    });
  });
};

if (typeof module === "object" && module.exports) {
  module.exports = compile;
}
else if (typeof window !== "undefined") {
  window.compile = compile;
}
