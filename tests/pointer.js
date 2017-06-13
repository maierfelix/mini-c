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
    **&e = *d;
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
  `i32 af(i32 &g) {
    g++;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = af(g);
    return (g);
  };
  `,
  `124`,
  `i32 test(i32 h) {
    h++;
    h += 1;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = test(g);
    return (g);
  };
  `,
  `123`,
  `i32 af(i32 &g) {
    g = 42;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = af(g);
    return (g);
  };`,
  `42`,
  `i32 af(i32 &g) {
    g = g + 1;
    g += 1;
    g++;
    --g;
    g++;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = af(g);
    return (g);
  };`,
  `126`,
  `i32 test(i32 &h) {
    h += 1;
    h = h + 2;
    h *= 2;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = test(g);
    return (g);
  };`,
  `252`,
  `i32 af(i32 &g) {
    g = g + 1;
    g += 1;
    g++;
    g++;
    ++g;
    g--;
    ++g;
    return (0);
  };
  i32 main() {
    i32 g = 123;
    i32 res = af(g);
    return (g);
  };`,
  `128`,
  `i32 main() {
    i32  a = 300;
    i32  b = 400;
    i32 &c = a;
    i32  d = 500;
    return (c == &a);
  };`,
  `1`,
  `i32 main() {
    i32  a = 300;
    i32  b = 400;
    i32 &c = a;
    i32  d = 500;
    c = 42;
    return (*c + a);
  };`,
  `84`
];
