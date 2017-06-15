module.exports = [
  `i32 test(i32 h) {
    h++;
    h += 1;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = test(g);
    return (g);
  };
  `,
  `123`
];