void baseAssign() {
  int a = 10;
  int b = 20;
  assert(a + b, 30);
};

void laterAssignWithExpr() {
  int a = 10;
  int b = 20;
  a = b * 2;
  assert(a, 40);
};

void deepInitialAssign() {
  int a = 10;
  int b = a = 20;
  assert(a + b, 40);
};

void deepInitialComplexAssign() {
  int a = 10;
  int aa = 11;
  int aaa = 12;
  int b = a = 20;
  int c = b = a = aa = aaa = a = 42;
  assert(a + aa + aaa + b + c, 210);
};

void laterDeepComplexAssign() {
  int a = 10;
  int aa = 11;
  int aaa = 12;
  int b = a = 20;
  int c = 0;
  b = a = aa = aaa = a = 42;
  assert(a + aa + aaa + b + c, 168);
};

void addAssign() {
  int a = 10;
  a += 1;
  assert(a, 11);
};

void subAssign() {
  int a = 10;
  a -= 1;
  assert(a, 9);
};

void mulAssign() {
  int a = 10;
  a *= 2;
  assert(a, 20);
};

void divAssign() {
  int a = 10;
  a /= 2;
  assert(a, 5);
};

void modAssign() {
  int a = 6;
  a %= 4;
  assert(a, 2);
};

void binOrAssign() {
  int a = 2;
  a |= 5;
  assert(a, 7);
};

void binAndAssign() {
  int a = 2;
  a &= 7;
  assert(a, 2);
};

void binXorAssign() {
  int a = 15;
  a ^= 5;
  assert(a, 10);
};

void binShlAssign() {
  int a = 3;
  a <<= 4;
  assert(a, 48);
};

void binShrAssign() {
  int a = 16;
  a >>= 2;
  assert(a, 4);
};

int main() {
  baseAssign();
  addAssign();
  subAssign();
  mulAssign();
  divAssign();
  modAssign();
  binOrAssign();
  binAndAssign();
  binXorAssign();
  binShlAssign();
  binShrAssign();
  laterAssignWithExpr();
  // FIXME
  //deepInitialAssign();
  //deepInitialComplexAssign();
  //laterDeepComplexAssign();
};
