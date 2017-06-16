module.exports = [
  `i32 add(i32 a, i32 b) {
    return (a + b);
  };
  i32 sub(i32 a, i32 b) {
    return (a - b);
  };
  export i32 main() {
    i32 *func1 = add;
    i32 *func2 = &add;
    return ((add == &add) && (add != sub) && sub > add);
  };
  `,
  `1`,
  `i32 add(i32 a, i32 b) {
    return (a + b);
  };
  export i32 main() {
    i32 *func1 = add;
    return (func1(6, 16));
  };`,
  `22`,
  `i32 add(i32 a, i32 b) {
    return (a + b);
  };
  export i32 main() {
    i32 *func1 = add;
    return (func1(6, 16) == add(6, 16));
  };`,
  `1`
];
