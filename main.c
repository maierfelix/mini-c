void swap(int *c, int *d) {
  int tmp = *c;
  *c = *d;
  *d = tmp;
};

int main() {
  int a = 10;
  int b = 20;
  swap(&a, &b);
  return (a);
};
