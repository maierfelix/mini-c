module.exports = [
  `i32 main() {
    i32  a = 300;
    i32  b = 400;
    i32 &c = a;
    i32  d = 500;
    c = 42;
    return (c + a);
  };`,
  `84`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 &c = b;
    return (c);
  };`,
  `66`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 &c = b;
    i32 d = c;
    return (d == c && d == 66);
  };`,
  `1`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 &c = b;
    i32 d = c;
    d = 77;
    return (c == b && d == 77);
  };`,
  `1`,
  `i32 main() {
    i32  a = 300;
    i32  b = 400;
    i32 &c = a;
    i32  d = 500;
    return (&c == &a);
  };`,
  `1`,
  `int main() {
    int a = 66;
    int b = 77;
    int *ptr = &b;
    int &c = *ptr;
    c = 77;
    return (c == b && (&c == &b));
  };
  `,
  `1`
];
