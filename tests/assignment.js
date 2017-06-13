module.exports = [
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    return (a + b);
  };`,
  `30`,
  `export i32 main() {
    i32 a = 10;
    i32 b = 20;
    a = b * 2;
    return (a);
  };`,
  `40`,
  `export i32 main() {
    i32 a = 10;
    i32 b = a = 20;
    return (a + b);
  };`,
  `40`,
  `export i32 main() {
    i32 a = 10;
    i32 aa = 11;
    i32 aaa = 12;
    i32 b = a = 20;
    i32 c = b = a = aa = aaa = a = 42;
    return (a + aa + aaa + b + c);
  };`,
  `210`,
  `export i32 main() {
    i32 a = 10;
    i32 aa = 11;
    i32 aaa = 12;
    i32 b = a = 20;
    i32 c = 0;
    b = a = aa = aaa = a = 42;
    return (a + aa + aaa + b + c);
  };`,
  `168`
];
