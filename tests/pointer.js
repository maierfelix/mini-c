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
  `i32 swap(i32 *c, i32 *d) {
    i32 *e = c;
    *(*(&e)) = *d;
    **&e = *d;
    return (0);
  };
  i32 main() {
    i32 a = 42;
    i32 b = 66;
    i32 *ptrB = &b;
    i32 res = swap(&a, ptrB);
    return ((*(&a)) + a + b);
  };`,
  `198`
];
