var x = {};

// Array.prototype.map
var a = [1, 2, 3].map(function (a) {
  return a + 1;
})

// Function.prototype.bind
console.log.bind(console);
