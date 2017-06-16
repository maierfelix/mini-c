module.exports = [
  `int add(int a, int b) {
    return (a + b);
  };
  int sub(int a, int b) {
    return (a - b);
  };
   int main() {
    int *func1 = add;
    int *func2 = &add;
    return ((add == &add) && (add != sub) && sub > add);
  };
  `,
  `1`,
  `int add(int a, int b) {
    return (a + b);
  };
   int main() {
    int *func1 = add;
    return (func1(6, 16));
  };`,
  `22`,
  `int add(int a, int b) {
    return (a + b);
  };
   int main() {
    int *func1 = add;
    return (func1(6, 16) == add(6, 16));
  };`,
  `1`
];
