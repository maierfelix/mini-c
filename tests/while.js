module.exports = [
  `export i32 main() {
    i32 a = 5;
    while (a < 100) {
      a = a + 3;
    };
    return (a);
  };`,
  `101`,
  `export i32 main() {
    i32 a = 5;
    while (1 == 0) {
      a = a + 3;
    };
    return (a);
  };`,
  `5`,
  `export i32 main(i32 a, i32 b) {
    i32 c = a + b;
    while (c < 75) {
      i32 d = 42;
      while (c < 100) {
        c += d;
        if (c >= 100) {
          i32 e = d * 2;
          if (1 == 1) {
            c = e * 2;
            break;
          }
        }
      };
    };
    return (c);
  };`,
  `168`,
  `export i32 main(i32 a, i32 b) {
    i32 c = a + b;
    while (1) {
      c += 1;
      if (c >= 100) { if (1 == 1) { c = 42; break; } }
    };
    return (c);
  };`,
  `42`
];
