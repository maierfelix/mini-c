int fact();
int lol(int a, int b);

int main() {
  int b = fact(22);
  assert(b, 14);
};

int fact(int a) {
  return (lol(5, 2) * 2);
};

int lol(int a, int b) {
  return (a + b);
};
