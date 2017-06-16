module.exports = [
  `i32 add(i32 a, i32 b) {
    return (a + b);
  };
  i32 sub(i32 a, i32 b) {
    return (a - b);
  };

  export i32 main() {
    i32 *func1 = add;
    if (1 == 1) { func1 = sub; }
    return (func1(10, 2));
  };
  `,
  `8`
];
