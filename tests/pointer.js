module.exports = [
  `i32 swap(i32 *c, i32 *d) {
    i32 tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  export i32 main() {
    int a = 10;
    int b = 20;
    swap(&a, &b);
    return (b);
  };`,
  `10`
];
