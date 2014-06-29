# where-does-this-run

dynamic analysis tool to determine what environments arbitrary JavaScript will run in

**Note:** the best way to make sure code works on a given environment to write tests for it,
and then run the tests on given environment.

![screenshot of where-does-this-run in a terminal window](https://raw.githubusercontent.com/btford/where-does-this-run/master/screenshot.jpg)

## How?

✨ If your JavaScript has good test coverage, anything is possible. ✨

Basically, the idea is to patch JavaScript APIs in the execution context of your tests,
then record which APIs your calls.

### Why not use Static Analysis?

Less fun.

Consider:

```javascript
with(Object) {
  keys({ foo: 'bar' });
}
```

Or:

```javascript
var foo = 'keys';
Object[foo]({ foo: 'bar' });
```

These cases are hard to catch statically.


## CLI

works like `node`:

```shell
$ where-does-this-run some-script.js
✗ IE 7
✗ IE 8
✔ IE 9
…
```

you can get JSON output like this:

```shell
$ where-does-this-run some-script.js --json
{"browsers":{"ie7":false,"ie8":false,"ie9":true,"ie10":true,"firefox3":false,"firefox3_5":false,"firefox4":true,…
```


## Caveats

Some native APIs in some JavaScript implementations (like `console.log` in node) rely on
`Object.keys`, etc. To avoid counting those calls, `where-does-this-run` patches those functions
with guards. This is done on a per-API basis. Any APIs that I miss will give incorrect results.

### Currently Supported APIs

`where-does-this-run` currently checks against these APIs:

* `Object.create`
* `Object.defineProperty`
* `Object.defineProperties`
* `Object.getPrototypeOf`
* `Object.keys`
* `Object.seal`
* `Object.freeze`
* `Object.preventExtensions`
* `Object.isSealed`
* `Object.isFrozen`
* `Object.isExtensible`
* `Object.getOwnPropertyDescriptor`
* `Object.getOwnPropertyNames`
* `Date.prototype.toISOString`
* `Date.now`
* `Array.isArray`
* `Function.prototype.bind`
* `String.prototype.trim`
* `Array.prototype.indexOf`
* `Array.prototype.lastIndexOf`
* `Array.prototype.every`
* `Array.prototype.some`
* `Array.prototype.forEach`
* `Array.prototype.map`
* `Array.prototype.filter`
* `Array.prototype.reduce`
* `Array.prototype.reduceRight`


## See also

* [kangax's ECMAScript 5 compatibility table](http://kangax.github.io/compat-table/es5/)


## license
MIT
