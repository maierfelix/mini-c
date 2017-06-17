module.exports = [
  `int swap(int *c, int *d) {
    int tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  int main() {
    int a = 10;
    int b = 20;
    swap(&a, &b);
    return (b);
  };`,
  `10`,
  `int swap(int *c, int *d) {
    int tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  int main() {
    int a = 42;
    int b = 66;
    int *ptrB = &b;
    int res = swap(&a, ptrB);
    return (*ptrB);
  };
  `,
  `42`,
  `int swap(int *c, int *d) {
    int tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    int res = swap(ptrA, ptrB);
    return (*ptrA);
  };`,
  `66`,
  `int swap(int *c, int *d) {
    int tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  int main() {
    int a = 42;
    int c = 55;
    int b = 66;
    int *ptrA = &a;
    int *ptrC = &c;
    int *ptrB = &b;
    int res = swap(ptrA, &b);
    return (*ptrA);
  };`,
  `66`,
  `int main() {
    int a = 10;
    int b = 20;
    return (&a);
  };`,
  `0`,
  `int main() {
    int a = 10;
    int b = 20;
    return (&b);
  };`,
  `4`,
  `int main() {
    int a = 10;
    int b = 20;
    int *ptr = &a;
    return (ptr);
  };`,
  `0`,
  `int main() {
    int a = 10;
    int b = 20;
    int *ptr = &b;
    return (ptr);
  };`,
  `4`,
  `int main() {
    int a = 10;
    int b = 20;
    int *ptr = &b;
    return (*ptr);
  };`,
  `20`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    ptrA = ptrB;
    return (*ptrA);
  };`,
  `66`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    ptrA = ptrB;
    return (*ptrA);
  };`,
  `66`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    ptrA = ptrB;
    return (ptrA == ptrB);
  };`,
  `1`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    ptrA = &b;
    return (ptrA == ptrB);
  };
  `,
  `1`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    ptrA = ptrB;
    return (*ptrA);
  };
  `,
  `66`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &a;
    ptrB = &b;
    return (*ptrB);
  };`,
  `66`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrC = &a;
    int *ptrA = &b;
    int *ptrB = &b;
    ptrA = ptrC;
    return (*ptrA);
  };`,
  `42`,
  `int main() {
    int a = 42; // 0x0
    int b = 66; // 0x4
    int *ptrA = 0x0;
    int *ptrB = 0x4;
    return (*ptrB);
  };`,
  `66`,
  `int main() {
    int a = 42;
    int b = 66;
    int *ptrA = &a;
    int *ptrB = &b;
    *ptrB = 77;
    return (*ptrB + b);
  };`,
  `154`,
  `int swap(int *c, int *d) {
    int *e = c;
    *(*(&e)) = *d;
    return (0);
  };
  int main() {
    int a = 42;
    int b = 66;
    int *ptr = &b;
    int res = swap(&a, ptr);
    return ((*(&a)) + b);
  };`,
  `132`,
  `int main() {
    int num = 10;
    int *ptr1 = &num;
    int *ptr2 = &ptr1;
    return (**ptr2 == *ptr1);
  };`,
  `1`,
  `int main() {
    int x = 0;
    int y = 0;
    int *p = &x;
    int *q = &y;
    int *pp = &p;
    pp = &q;
    **pp = 4;
    return (y == 4 && x == 0);
  };
  `,
  `1`,
  `int main() {
    int a = 100;
    int *ptr = &a;
    return ((&ptr != &a) && ptr == &a);
  };
  `,
  `1`,
  `int main() {
    int b = 66;
    int *ptr = &b;
    return ((&*ptr) == &b);
  };`,
  `1`,
  `int main() {
    int a = 66;
    int b = 77;
    int *ptr = &b;
    return (&*ptr == &b);
  };`,
  `1`,
  `int main() {
    int x = 7;
    int a = 66;
    int *ptr = &a;
    return (*&ptr == &*ptr);
  };`,
  `1`,
  // FIX pointer address incr/decr
  `int main() {
    int a = 1;
    int b = 2;
    int *ptr = &b;
    ptr++;
    ++ptr;
    *ptr++;
    *(ptr)++;
    *++ptr;
    *(++ptr);
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    int h = 8;
    int i = 9;
    return (ptr);
  };`,
  `1`
];
