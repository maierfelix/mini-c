enum fruits {
  orange = 6,
  banana = 2 * 4,
  apple = banana,
  peach
};

int main() {
  assert(
    orange == 6 &&
    banana == 8 &&
    apple == 8 &&
    peach == 9
  , 1);
};
