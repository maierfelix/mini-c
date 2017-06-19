int test1() {
  int a = -10;
  return (-(++a + -30 - -10) * -8);
};

int test2() {
  int a = -10;
  return (-(a++ + -30 - -10) * -8);
};

int test3() {
  int i = 0;
  int a = 5;
  while (i++ < 100) {
    a = a + 1;  
  };
  return (i);
};

int test4() {
  int i = 0;
  int a = 5;
  while (++i < 100) {
    a = a + 1;  
  };
  return (i);
};

int test5() {
  int a = -10;
  return (-(a-- + -30 - -10) * -8);
};

int test6() {
  int a = -10;
  return (-(--a + -30 - -10) * -8);
};

int test7() {
  int i = 100;
  int a = 5;
  while (i-- > 0) {
    a = a + 1;  
  };
  return (i);
};

int test8() {
  int i = 100;
  int a = 5;
  while (--i > 0) {
    a = a + 1;  
  };
  return (a);
};

int test9() {
  int i = 0;
  int j = ++i;
  int k = i++;
  return (i);
};

int test10() {
  int i = 0;
  int j = ++i;
  int k = i++;
  return (j);
};

int test11() {
  int i = 0;
  int j = ++i;
  int k = i++;
  return (k);
};

void test12a(int *h) {
  *h = 124;
  *h += 1;
  ++(*h);
};
int test12b() {
  int g = 123;
  test12a(&g);
  return (g == 126);
};

void test13a(int *h) {
  *h = 124;
  *h += 1;
  (*h)++;
};
int test13b() {
  int g = 123;
  test13a(&g);
  return (g == 126);
};

int test14a(int h) {
  h += 1;
  h++;
  ++h;
  return (h++);
};
int test14b() {
  int g = 123;
  return (test14a(g));
};

int test15a(int h) {
  h += 1;
  h++;
  ++h;
  return (++h);
};
int test15b() {
  int g = 123;
  return (test15a(g));
};

int main() {
  assert(test1(), -232);
  assert(test2(), -240);
  assert(test3(), 101);
  assert(test4(), 100);
  assert(test5(), -240);
  assert(test6(), -248);
  assert(test7(), -1);
  assert(test8(), 104);
  assert(test9(), 2);
  assert(test10(), 1);
  assert(test11(), 1);
  assert(test12b(), 1);
  assert(test13b(), 1);
  assert(test14b(), 126);
  assert(test15b(), 127);
};
