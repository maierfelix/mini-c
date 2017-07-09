# mini-c
[Demo](http://maierfelix.github.io/mini-c/)

### Description:
This is an experimental C compiler which compiles into WebAssembly. It's currently written in plain JavaScript but will be rewritten in C (and get self-hosted) as soon as the compiler has enough features to do so.

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
You can either run the tests like below or using the [html version](http://www.felixmaier.info/mini-c/test/)
````js
cd node
node test
