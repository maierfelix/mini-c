module.exports = [
 `int fact();
  int lol(int a, int b);
  extern int main() {
    int b = fact(22);
    return (b);
  };
  int fact(int a) {
    return (lol(5, 2) * 2);
  };
  int lol(int a, int b) {
    return (a + b);
  };
  `,
  `14`
];
