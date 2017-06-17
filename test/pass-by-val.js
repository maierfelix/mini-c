module.exports = [
  `int test(int h) {
    h = 124;
    return (h);
  };
  int main() {
    int g = 123;
    int res = test(g);
    return (g + 1 == res);
  };`,
  `1`,
  `int test(int h) {
    h++;
    h += 1;
    return (h);
  };
  int main() {
    int g = 123;
    int res = test(g);
    return (g == 123 && res == 125);
  };`,
  `1`,
  `int test(int h) {
    h = 124;
    ++h;
    h += 1;
    return (h + 1);
  };
  int main() {
    int g = 123;
    int res = test(g);
    return (g == 123 && res == 127);
  };`,
  `1`
];
