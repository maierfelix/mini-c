module.exports = [
  ` int main() {
    int a = 5;
    if (a == 5) {
      a = 25;
    } else {
      a = a * 2;
    }
    return (a);
  };`,
  `25`,
  ` int main() {
    int a = 42;
    if (a == 5) {
      a = 25;
    } else {
      a = a * 2;
    }
    return (a);
  };`,
  `84`,
  ` int main() {
    int a = 0;
    int b = 0;
    while (a < 100) {
      if (a == 5) {
        b = 25;
      }
      else if (a == 10) {
        b = 42;  
      }
      else {
        b = a * 2;
      }
      a = a + 1;
    };
    return (b);
  };`,
  `198`
];
