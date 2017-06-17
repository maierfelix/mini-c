module.exports = [
  `int main() {
    int a = -10;
    return (-(++a + -30 - -10) * -8);
  };
  `,
  `-232`,
  `int main() {
    int a = -10;
    return (-(a++ + -30 - -10) * -8);
  };
  `,
  `-240`,
  `int main() {
    int i = 0;
    int a = 5;
    while (i++ < 100) {
      a = a + 1;  
    };
    return (i);
  };
  `,
  `101`,
  `int main() {
    int i = 0;
    int a = 5;
    while (++i < 100) {
      a = a + 1;  
    };
    return (i);
  };`,
  `100`,
  `int main() {
    int a = -10;
    return (-(a-- + -30 - -10) * -8);
  };`,
  `-240`,
  `int main() {
    int a = -10;
    return (-(--a + -30 - -10) * -8);
  };`,
  `-248`,
  `int main() {
    int i = 100;
    int a = 5;
    while (i-- > 0) {
      a = a + 1;  
    };
    return (i);
  };`,
  `-1`,
  `int main() {
    int i = 100;
    int a = 5;
    while (--i > 0) {
      a = a + 1;  
    };
    return (a);
  };`,
  `104`,
  `int main() {
    int i = 0;
    int j = ++i;
    int k = i++;
    return (i);
  };`,
  `2`,
  `int main() {
    int i = 0;
    int j = ++i;
    int k = i++;
    return (j);
  };`,
  `1`,
  `int main() {
    int i = 0;
    int j = ++i;
    int k = i++;
    return (k);
  };`,
  `1`,
  `void test(int *h) {
    *h = 124;
    *h += 1;
    ++(*h);
  };
  int main() {
    int g = 123;
    test(&g);
    return (g == 126);
  };`,
  `1`,
  `void test(int *h) {
    *h = 124;
    *h += 1;
    (*h)++;
  };
  int main() {
    int g = 123;
    test(&g);
    return (g == 126);
  };`,
  `1`,
  `int test(int h) {
    h += 1;
    h++;
    ++h;
    return (h++);
  };
  int main() {
    int g = 123;
    return (test(g));
  };
  `,
  `126`,
  `int test(int h) {
    h += 1;
    h++;
    ++h;
    return (++h);
  };
  int main() {
    int g = 123;
    return (test(g));
  };
  `,
  `127`
];
