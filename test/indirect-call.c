int add(int a, int b) {
  return (a + b);
};

int sub(int a, int b) {
  return (a - b);
};

int main() {
  int (*func1)(int, int) = add;
  if (1 == 1) { func1 = sub; }
  assert(func1(10, 2), 8)
};
