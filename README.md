# <img width="42%" src="http://i.imgur.com/lJGRXvt.png" />
[Just let me play with him](http://maierfelix.github.io/momo/)

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

### Building
````
cd node
node index
````
This generates ``bin/dist.js``

### Testing
````js
cd node
node test
````