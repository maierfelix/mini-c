int add(int a, int b) {
  return (a + b);
};

int sub(int a, int b) {
  return (a - b);
};

int test1() {
  return ((add == &add) && (add != sub) && sub > add);
};

int test2() {
  int (*func1)(int, int) = add;
  return (func1(6, 16));
};

int test3() {
  int (*func1)(int, int) = add;
  return (func1(6, 16) == add(6, 16));
};

int babelfish() {
  return (42);
};

int test4() {
  int (*func1)() = babelfish;
  return (func1());
};

int test5(int a) {
  int (*fn)(int, int) = add;
  if (a == 1) { fn = sub; }
  return (fn(6, 12));
};

int main() {
  assert(test1(), 1);
  assert(test2(), 22);
  assert(test3(), 1);
  assert(test4(), 42);
  assert(test5(0), 18);
  assert(test5(1), -6);
};
