module.exports = [
  `void assert(int truth) {
    if (!truth) { §TRAP; }
  };
  int main() {
    assert(1 == 1);
  };
  `, `0`,
  `void assert(int truth) {
    if (!truth) { §TRAP; }
  };
  int main() {
    assert(1 == 0);
  };`, `::RuntimeError`
];