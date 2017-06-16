# <img width="10%" src="http://i.imgur.com/mquA9Ww.png" /> mini-wasm 
[Just let me play with it](http://maierfelix.github.io/momo/)

### Description:
This is an experimental C compiler which compiles into WebAssembly. It's currently written in plain JavaScript but will be rewritten in C (and get self-hosted) as soon as the compiler has enough features to do so.

### Syntax:

````c
int fact(i32 n) {
  if (n == 0) {
    return 1;
  }
  return (n * fact(n - 1));
};
extern int main(int a, int b) {
  return (fact(a + b));
};
````

### Pipeline:
 - **Scanner**: Creates a token array out of the input
 - **Parser**: Eats tokens and generates an AST out of them
 - **Emitter**: Recursively walks the AST (*Luke ASTwalker*) and clumps together a uint8 array which gets passed over into WebAssembly

### API:

#### Compiling a source file:
````js
compile(src: String, imports: Object, sync: Boolean)
````
````js
compile(`
  int main(int a, int b) {
    return (a + b);
  };
`, {}, false);
````
 
### Contribution:
 - Feel free to send any kind of pull request
