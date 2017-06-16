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
  `24`
];
