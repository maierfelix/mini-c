module.exports = [
  ` int main() {
    int a = 10;
    int b = 20;
    return (a + b);
  };`,
  `30`,
  ` int main() {
    int a = 10;
    int b = 20;
    a = b * 2;
    return (a);
  };`,
  `40`,
  ` int main() {
    int a = 10;
    int b = a = 20;
    return (a + b);
  };`,
  `40`,
  ` int main() {
    int a = 10;
    int aa = 11;
    int aaa = 12;
    int b = a = 20;
    int c = b = a = aa = aaa = a = 42;
    return (a + aa + aaa + b + c);
  };`,
  `210`,
  ` int main() {
    int a = 10;
    int aa = 11;
    int aaa = 12;
    int b = a = 20;
    int c = 0;
    b = a = aa = aaa = a = 42;
    return (a + aa + aaa + b + c);
  };`,
  `168`
];
