module.exports = [
  `i32 main() {
    i32 a = -10;
    return (-(++a + -30 - -10) * -8);
  };
  `,
  `-232`,
  `i32 main() {
    i32 a = -10;
    return (-(a++ + -30 - -10) * -8);
  };
  `,
  `-240`,
  `i32 main() {
    i32 i = 0;
    i32 a = 5;
    while (i++ < 100) {
      a = a + 1;  
    };
    return (i);
  };
  `,
  `101`,
  `i32 main() {
    i32 i = 0;
    i32 a = 5;
    while (++i < 100) {
      a = a + 1;  
    };
    return (i);
  };`,
  `100`,
  `i32 main() {
    i32 a = -10;
    return (-(a-- + -30 - -10) * -8);
  };`,
  `-240`,
  `i32 main() {
    i32 a = -10;
    return (-(--a + -30 - -10) * -8);
  };`,
  `-248`,
  `i32 main() {
    i32 i = 100;
    i32 a = 5;
    while (i-- > 0) {
      a = a + 1;  
    };
    return (i);
  };`,
  `-1`,
  `i32 main() {
    i32 i = 100;
    i32 a = 5;
    while (--i > 0) {
      a = a + 1;  
    };
    return (a);
  };`,
  `104`
];