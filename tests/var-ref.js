module.exports = [
  `int main() {
    int  a = 300;
    int  b = 400;
    int &c = a;
    int  d = 500;
    c = 42;
    return (c + a);
  };`,
  `84`,
  `int main() {
    int a = 42;
    int b = 66;
    int &c = b;
    return (c);
  };`,
  `66`,
  `int main() {
    int a = 42;
    int b = 66;
    int &c = b;
    int d = c;
    return (d == c && d == 66);
  };`,
  `1`,
  `int main() {
    int a = 42;
    int b = 66;
    int &c = b;
    int d = c;
    d = 77;
    return (c == b && d == 77);
  };`,
  `1`,
  `int main() {
    int  a = 300;
    int  b = 400;
    int &c = a;
    int  d = 500;
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
