# mini-wasm

[Just let me play with it](http://maierfelix.github.io/mini-wasm/)

### Description:
This is a small compiler, offering a basic C-like language which compiles into WebAssembly.

### Syntax:

````c++
i32 fact(i32 n) {
  if (n == 0) {
    return 1;
  }
  return (n * fact(n - 1));
};
export i32 main(i32 a, i32 b) {
  return (fact(a + b));
};
````

### Pipeline:
 - **Scanner**: Creates a token array out of the input
 - **Parser**: Eats tokens and generates an AST out of them
 - **Emitter**: Recursively walks the AST (*Luke ASTwalker*) and clumps together a uint8 array which gets passed over into WebAssembly

### Planned features:
 - Structs (import/export bridge to JavaScript)
 - Pointers (I always get a strange bug when i try to store something in memory)

### Contribution:
 - Feel free to send any kind of pull request as long as it's not grammy fixxes ⭐
