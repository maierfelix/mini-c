module.exports = [
  `
  i32 test = 4;
  export i32 main(i32 a, i32 b) {
    return (test);
  };`,
  `4`,
  `
  i32 test = 4;
  export i32 main(i32 a, i32 b) {
    test = 8;
    return (test);
  };
  `,
  `8`
];
