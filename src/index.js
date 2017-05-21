"use strict";

// # compiler globals
let bytes = null;
let scope = null;
let pindex = 0;
let tokens = null;
let current = null;
let findex = 0;
let __imports = null;

function compile(str, imports) {
  // reset
  findex = pindex = 0;
  scope = current = __imports = tokens = null;
  bytes = new ByteArray();
  __imports = imports;

  let tkns = scan(str);
  let ast = parse(tkns);
  bytes.emitU32(WASM_MAGIC);
  bytes.emitU32(WASM_VERSION);
  emit(ast);
  let buffer = new Uint8Array(bytes);
  let dump = Array.from(buffer).map((v) => { return (v.toString(16)); });
  let instance = new WebAssembly.Instance(new WebAssembly.Module(buffer));
  return ({
    dump: dump,
    buffer: buffer,
    module: instance,
    exports: instance.exports
  });
};

if (typeof module === "object" && module.exports) {
  module.exports = compile;
}
else if (typeof window !== "undefined") {
  window.compile = compile;
}
