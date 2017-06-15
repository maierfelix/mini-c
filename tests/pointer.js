module.exports = [
  `i32 swap(i32 *c, i32 *d) {
    i32 tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  export i32 main() {
    i32 a = 10;
    i32 b = 20;
    swap(&a, &b);
    return (b);
  };`,
  `10`,
  `i32 swap(i32 *c, i32 *d) {
    i32 tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrB = &b;
    i32 res = swap(&a, ptrB);
    return (*ptrB);
  };
  `,
  `42`,
  `i32 swap(i32 *c, i32 *d) {
    i32 tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    i32 res = swap(ptrA, ptrB);
    return (*ptrA);
  };`,
  `66`,
  `i32 swap(i32 *c, i32 *d) {
    i32 tmp = *c;
    *c = *d;
    *d = tmp;
    return (0);
  };
  i32 main() {
    i32 a = 42;
    i32 c = 55;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrC = &c;
    i32 *ptrB = &b;
    i32 res = swap(ptrA, &b);
    return (*ptrA);
  };`,
  `66`,
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    return (&a);
  };`,
  `0`,
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    return (&b);
  };`,
  `4`,
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    i32 *ptr = &a;
    return (ptr);
  };`,
  `0`,
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    i32 *ptr = &b;
    return (ptr);
  };`,
  `4`,
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    i32 *ptr = &b;
    return (*ptr);
  };`,
  `20`,
  ``,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    ptrA = ptrB;
    return (*ptrA);
  };
  `,
  `66`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    ptrA = ptrB;
    return (*ptrA);
  };
  `,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    ptrA = ptrB;
    return (ptrA == ptrB);
  };
  `,
  `1`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    ptrA = &b;
    return (ptrA == ptrB);
  };
  `,
  `1`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    ptrA = ptrB;
    return (*ptrA);
  };
  `,
  `66`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &a;
    ptrB = &b;
    return (*ptrB);
  };`,
  `66`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrC = &a;
    i32 *ptrA = &b;
    i32 *ptrB = &b;
    ptrA = ptrC;
    return (*ptrA);
  };`,
  `42`,
  `i32 main() {
    i32 a = 42; // 0x0
    i32 b = 66; // 0x4
    i32 *ptrA = 0x0;
    i32 *ptrB = 0x4;
    return (*ptrB);
  };`,
  `66`,
  `i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrA = &a;
    i32 *ptrB = &b;
    *ptrB = 77;
    return (*ptrB + b);
  };`,
  `154`,
  `i32 swap(i32 *c, i32 *d) {
    i32 *e = c;
    *(*(&e)) = *d;
    return (0);
  };
  i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptr = &b;
    i32 res = swap(&a, ptr);
    return ((*(&a)) + b);
  };`,
  `132`,
  `i32 main() {
    i32 num = 10;
    i32 *ptr1 = &num;
    i32 *ptr2 = &ptr1;
    return (**ptr2 == *ptr1);
  };`,
  `1`,
  `i32 main() {
    i32 x = 0;
    i32 y = 0;
    i32 *p = &x;
    i32 *q = &y;
    i32 *pp = &p;
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
  `i32 main() {
    i32 b = 66;
    i32 *ptr = &b;
    return ((&*ptr) == &b);
  };`,
  `1`,
  `i32 main() {
    i32 a = 66;
    i32 b = 77;
    i32 *ptr = &b;
    return (&*ptr == &b);
  };`,
  `1`,
  `i32 main() {
    i32 x = 7;
    i32 a = 66;
    i32 *ptr = &a;
    return (*&ptr == &*ptr);
  };`,
  `1`
];
