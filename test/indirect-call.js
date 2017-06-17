module.exports = [
  `int add(int a, int b) {
    return (a + b);
  };
  int sub(int a, int b) {
    return (a - b);
  };
  int main() {
    int *func1 = add;
    if (1 == 1) { func1 = sub; }
    return (func1(10, 2));
  };
  `,
  `8`
];
