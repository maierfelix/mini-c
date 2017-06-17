module.exports = [
  `int main() {
    int a = 10;
    int b = 20;
    return (a + b);
  };`,
  `30`,
  `int main() {
    int a = 10;
    int b = 20;
    a = b * 2;
    return (a);
  };`,
  `40`,
  `int main() {
    int a = 10;
    int b = a = 20;
    return (a + b);
  };`,
  `40`,
  `int main() {
    int a = 10;
    int aa = 11;
    int aaa = 12;
    int b = a = 20;
    int c = b = a = aa = aaa = a = 42;
    return (a + aa + aaa + b + c);
  };`,
  `210`,
  `int main() {
    int a = 10;
    int aa = 11;
    int aaa = 12;
    int b = a = 20;
    int c = 0;
    b = a = aa = aaa = a = 42;
    return (a + aa + aaa + b + c);
  };`,
  `168`,
  `int main() { int a = 10; a += 1; return (a); };`, `11`,
  `int main() { int a = 10; a -= 1; return (a); };`, `9`,
  `int main() { int a = 10; a *= 2; return (a); };`, `20`,
  `int main() { int a = 10; a /= 2; return (a); };`, `5`,
  `int main() { int a = 6; a %= 4; return (a); };`, `2`,
  `int main() { int a = 2; a |= 5; return (a); };`, `7`,
  `int main() { int a = 2; a &= 7; return (a); };`, `2`,
  `int main() { int a = 2; a |= 5; return (a); };`, `7`,
  `int main() { int a = 15; a ^= 5; return (a); };`, `10`,
  `int main() { int a = 3; a <<= 4; return (a); };`, `48`,
  `int main() { int a = 16; a >>= 2; return (a); };`, `4`
];
