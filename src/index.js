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

  let tkns = scan(str);
  let ast = parse(tkns);
  //console.log(ast);
  emit(ast);
  let buffer = new Uint8Array(bytes);
  let valid = WebAssembly.validate(buffer);
  let dump = hexDump(buffer);
  let module = new WebAssembly.Module(buffer);
  let instance = new WebAssembly.Instance(module);
  let output = {
    ast: ast,
    dump: dump,
    buffer: buffer,
    instance: instance,
    exports: instance.exports
  };
  console.log(output);
  return (output);
};

if (typeof module === "object" && module.exports) {
  module.exports = compile;
}
else if (typeof window !== "undefined") {
  window.compile = compile;
}
