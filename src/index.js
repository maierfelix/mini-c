"use strict";

// # compiler globals
let bytes = null;
let scope = null;
let global = null;
let pindex = 0;
let tokens = null;
let current = null;
let __imports = null;

function hexDump(array) {
  let result = Array.from(array).map((v) => {
    return (v.toString(16));
  });
  return (result);
};

function memoryDump(array, limit) {
  let str = "";
  for (let ii = 0; ii < limit; ii += 4) {
    str += ii;
    str += ": ";
    str += array[ii + 0] + ", ";
    str += array[ii + 1] + ", ";
    str += array[ii + 2] + ", ";
    str += array[ii + 3] + " ";
    str += "\n";
  };
  return (str);
};

function loadStdlib() {
  return new Promise((resolve, reject) => {
    fetch("../stdlib/memory.momo").then((resp) => resp.text().then((txt) => {
      resolve(txt);
    }));
  });
};

function compile(str, imports, sync) {
  // reset
  pindex = 0;
  scope = global = current = __imports = tokens = null;
  bytes = new ByteArray();
  __imports = imports;
  currentHeapOffset = 0;

  // process
  let tkns = scan(str);
  let ast = parse(tkns);
  emit(ast);
  let buffer = new Uint8Array(bytes);
  let dump = hexDump(buffer);

  // output
  if (sync === true) {
    let module = new WebAssembly.Module(buffer);
    let instance = new WebAssembly.Instance(module);
    return ({
      ast: ast,
      dump: dump,
      buffer: buffer,
      memory: instance.exports.memory,
      instance: instance,
      exports: instance.exports
    });
  }
  return new Promise((resolve, reject) => {
    WebAssembly.instantiate(buffer).then((result) => {
      let instance = result.instance;
      resolve({
        ast: ast,
        dump: dump,
        buffer: buffer,
        memory: instance.exports.memory,
        instance: instance,
        exports: instance.exports
      });
    });
  });
};

if (typeof module === "object" && module.exports) {
  module.exports = compile;
}
else if (typeof window !== "undefined") {
  window.compile = compile;
}
