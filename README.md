# where-does-this-run

dynamic analysis tool to determine what environments arbitrary JavaScript will run in

**Note:** the best way to make sure code works on a given environment to write tests for it,
and then run the tests on given environment.


## How?

✨ If your JavaScript has good test coverage, anything is possible. ✨

Basically, the idea is to patch JavaScript APIs in the execution context of your tests,
then record which APIs your calls.

### Why not use Static Analysis?

Less fun.

## See also

* [kangax's ECMAScript 5 compatibility table](http://kangax.github.io/compat-table/es5/)

## license
MIT
