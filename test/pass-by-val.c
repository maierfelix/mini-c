int passValue(int h) {
  h = 124;
  return (h);
};

int passAndIncrValue(int h) {
  h++;
  h += 1;
  return (h);
};

int passAndComplexIncr(int h) {
  h = 124;
  ++h;
  h += 1;
  return (h + 1);
};

int main() {
  int g = 123;
  assert(g + 1 == passValue(g), 1);
  g = 123;
  assert(g == 123 && passAndIncrValue(g) == 125, 1);
  g = 123;
  int res = passAndComplexIncr(g);
  assert(g == 123 && res == 127, 1);
};
