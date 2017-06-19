int test1a(int *c, int *d) {
  int tmp = *c;
  *c = *d;
  *d = tmp;
  return (0);
};
int test1b() {
  int a = 10;
  int b = 20;
  test1a(&a, &b);
  return (b);
};

int test2a(int *c, int *d) {
  int tmp = *c;
  *c = *d;
  *d = tmp;
  return (0);
};
int test2b() {
  int a = 42;
  int b = 66;
  int *ptrB = &b;
  int res = test2a(&a, ptrB);
  return (*ptrB);
};

int test3a(int *c, int *d) {
  int tmp = *c;
  *c = *d;
  *d = tmp;
  return (0);
};
int test3b() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  int res = test3a(ptrA, ptrB);
  return (*ptrA);
};

int test4a(int *c, int *d) {
  int tmp = *c;
  *c = *d;
  *d = tmp;
  return (0);
};
int test4b() {
  int a = 42;
  int c = 55;
  int b = 66;
  int *ptrA = &a;
  int *ptrC = &c;
  int *ptrB = &b;
  int res = test4a(ptrA, &b);
  return (*ptrA);
};

int test9() {
  int a = 10;
  int b = 20;
  int *ptr = &b;
  return (*ptr);
};

int test10() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  ptrA = ptrB;
  return (*ptrA);
};

int test11() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  ptrA = ptrB;
  return (*ptrA);
};

int test12() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  ptrA = ptrB;
  return (ptrA == ptrB);
};

int test13() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  ptrA = &b;
  return (ptrA == ptrB);
};

int test14() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  ptrA = ptrB;
  return (*ptrA);
};

int test15() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &a;
  ptrB = &b;
  return (*ptrB);
};

int test16() {
  int a = 42;
  int b = 66;
  int *ptrC = &a;
  int *ptrA = &b;
  int *ptrB = &b;
  ptrA = ptrC;
  return (*ptrA);
};

int test17() {
  int a = 42;
  int b = 66;
  int *ptrA = &a;
  int *ptrB = &b;
  *ptrB = 77;
  return (*ptrB + b);
};

int test18a(int *c, int *d) {
  int *e = c;
  *(*(&e)) = *d;
  return (0);
};
int test18b() {
  int a = 42;
  int b = 66;
  int *ptr = &b;
  int res = test18a(&a, ptr);
  return ((*(&a)) + b);
};

int test19() {
  int num = 10;
  int *ptr1 = &num;
  int *ptr2 = ptr1;
  return (*ptr2 == *ptr1);
};

int test20() {
  int x = 0;
  int y = 0;
  int *p = &x;
  int *q = &y;
  int *pp = &p;
  pp = &q;
  **pp = 4;
  return (y == 4 && x == 0);
};

int test21() {
  int a = 100;
  int *ptr = &a;
  return ((&ptr != &a) && ptr == &a);
};

int test22() {
  int b = 66;
  int *ptr = &b;
  return ((&*ptr) == &b);
};

int test23() {
  int a = 66;
  int b = 77;
  int *ptr = &b;
  return (&*ptr == &b);
};

int test24() {
  int x = 7;
  int a = 66;
  int *ptr = &a;
  return (*&ptr == &*ptr);
};

int main() {
  assert(test1b(), 10);
  assert(test2b(), 42);
  assert(test3b(), 66);
  assert(test4b(), 66);
  assert(test9(), 20);
  assert(test10(), 66);
  assert(test11(), 66);
  assert(test12(), 1);
  assert(test13(), 1);
  assert(test14(), 66);
  assert(test15(), 66);
  assert(test16(), 42);
  assert(test17(), 154);
  assert(test18b(), 132);
  assert(test19(), 1);
  assert(test20(), 1);
  assert(test21(), 1);
  assert(test22(), 1);
  assert(test23(), 1);
  assert(test24(), 1);
};
