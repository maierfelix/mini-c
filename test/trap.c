void asserty(int truth) {
  if (!truth) { §TRAP; }
};

int main() {
  asserty(1 == 1);
  // FIXME
  //assert(1 == 0);
};
