"use strict";

class ByteArray extends Array {
  emitU8(value) {
    this.push(value);
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
    }
  }
  patchU32v(value, offset) {
    let idx = 0;
    while (true) {
      let v = value & 0xff;
      value = value >>> 7;
      if (value == 0) {
        this[offset + idx] = v;
        break;
      }
      this[offset + idx] = v | 0x80;
      idx++;
    }
  }
  createU32vPatch() {
    let offset = this.length;
    this.emitU32v(0);
    return ({
      offset: offset,
      patch: (value) => this.patchU32v(value, offset)
    });
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
