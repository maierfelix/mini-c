module.exports = [
  `int fact(int n) {
    if (n == 0) {
      return 1;
    }
    return(n * fact(n - 1));
  };
   int main(int a, int b) {
    return (fact(4));
  };`,
  `24`,
  `int glob = 0;
  void test(int a) {
    if (a == 1) { glob = 42; }
  };

  extern int main() {
    test(1);
    return (glob);
  };
  `,
  `42`
];
