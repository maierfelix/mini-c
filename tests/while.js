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
  `5`
];
