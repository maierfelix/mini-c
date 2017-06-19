int glob1 = 4;
int glob2 = 0;

void test(int a) {
  if (a == 1) { glob2 = 42; }
};

int main() {
  assert(glob1, 4);
  glob1 = 8;
  assert(glob1, 8);
  test(1);
  assert(glob2, 42);
};
