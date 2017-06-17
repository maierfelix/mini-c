"use strict";

class ByteArray extends Array {
  emitU8(value) {
    this.push(value & 0xff);
  }
  emitU16(value) {
    this.push(value & 0xff);
    this.push((value >> 8) & 0xff);
  }
  emitU32(value) {
    this.push(value & 0xff);
    this.push((value >> 8) & 0xff);
    this.push((value >> 16) & 0xff);
    this.push((value >> 24) & 0xff);
  }
  emitU32v(value) {
    while (true) {
      let v = value & 0xff;
      value = value >>> 7;
      if (value == 0) {
        this.push(v);
        break;
      }
      this.push(v | 0x80);
    };
  }
  emit32v(value) {
    while (true) {
      var element = value & 127;
      value = value >> 7;
      var done = value === 0 && (element & 64) === 0 || value === -1 && (element & 64) !== 0;
      if (!done) {
        element = element | 128;
      }
      this.push(element & 255);
      if (done) break;
    }
  }
  emitULEB128(value) {
    let el = 0;
    do {
      el = value & 0x7F;
      value = value >>> 7;
      if (value) el = el | 0x80;
      this.push(el);
    } while (value);
  }
  emitLEB128(value) {
    let el = 0;
    do {
      el = value & 0x7F;
      value = value >>> 7;
      let sign = (el & 0x40) !== 0;
      if (
        ((value === 0) && !sign) ||
        ((value === -1) && sign)
      ) {
        this.push(el);
        break;
      } else {
        el = el | 0x80;
        this.push(el);
      }
    } while (true);
  }
  patchLEB128(value, offset) {
    let el = 0;
    let idx = 0;
    do {
      el = value & 0x7F;
      value = value >>> 7;
      let sign = (el & 0x40) !== 0;
      if (
        ((value === 0) && !sign) ||
        ((value === -1) && sign)
      ) {
        this[offset + idx] = el;
        break;
      } else {
        el = el | 0x80;
        this[offset + idx] = el;
        idx++;
      }
    } while (true);
  }
  patchULEB128(value, offset) {
    let el = 0;
    let idx = 0;
    do {
      el = value & 0x7F;
      value = value >>> 7;
      if (value) el = el | 0x80;
      this[offset + idx] = el;
      idx++;
    } while (value);
  }
  createU32vPatch() {
    this.writeVarUnsigned(~0);
    let offset = this.length;
    return ({
      offset: offset,
      patch: (value) => {
        this.patchU32v(value, offset - 5);
      }
    });
  }
  patchU32v(value, offset) {
    var current = value >>> 0;
    var max = -1 >>> 0;
    while (true) {
      var element = current & 127;
      current = current >>> 7;
      max = max >>> 7;
      if (max !== 0) {
        element = element | 128;
      }
      this[offset] = element & 255;
      offset++;
      if (max === 0) break;
    };
  }
  writeVarUnsigned(value) {
    var current = value >>> 0;
    while (true) {
      var element = current & 127;
      current = current >>> 7;
      if (current !== 0) {
        element = element | 128;
      }
      this.push(element & 255);
      if (current === 0) {
        break;
      }
    }
  }
  createLEB128Patch() {
    let offset = this.length;
    this.emitU8(0);
    return ({
      offset: offset,
      patch: (value) => this.patchLEB128(value, offset)
    });
  }
  createULEB128Patch() {
    let offset = this.length;
    this.emitU8(0);
    return ({
      offset: offset,
      patch: (value) => this.patchULEB128(value, offset)
    });
  }
  emitUi32(value) {
    value = value | 0;
    this.emitU8(WASM_OPCODE_I32_CONST);
    this.writeVarUnsigned(value);
  }
  emitLoad32() {
    this.emitU8(WASM_OPCODE_I32_LOAD);
    this.emitU8(2); // i32 alignment
    this.writeVarUnsigned(0);
  }
  emitStore32() {
    this.emitU8(WASM_OPCODE_I32_STORE);
    this.emitU8(2); // i32 alignment
    this.writeVarUnsigned(0);
  }
  emitString(str) {
    var length = str.length | 0;
    this.emitU32v(length);
    var offset = this.length;
    var ii = 0;
    while (ii < length) {
      this.push(str.charCodeAt(ii) & 0xff);
      ii++;
    };
  }
};
