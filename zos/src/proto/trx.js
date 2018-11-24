var Immutable  = require("immutable"),
    t          = require("transducers-js"),
    comp       = t.comp,
    map        = t.map,
    filter     = t.filter,
    transduce  = t.transduce;

var inc = function(n) { return n + 1; };
var isEven = function(n) { return n % 2 == 0; };
var sum = function(a,b) { return a+b; };

var largeVector = Immutable.List();

for(var i = 0; i < 1000000; i++) {
    largeVector = largeVector.push(i);
}

// built in Immutable-js functionality
largeVector.map(inc).filter(isEven).reduce(sum);

// faster with transducers
var xf = comp(
  map(inc),
  filter(isEven));
transduce(xf, sum, 0, largeVector);
