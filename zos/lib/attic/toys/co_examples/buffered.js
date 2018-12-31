// jshint esnext:true

var chan = require('chan')
var co   = require('co')
var wait = require('co-wait')
var ch   = chan(25)

co(function *() {
  var n
  while (!ch.done()) {
    yield wait(2500 * Math.random())
    console.log('<-- ' + (yield ch))
  }
}).then(function() { console.log('Done1');});


co(function *() {
  var n = 5000
  while (n-- > 0) {
    yield ch.async(n);
    console.log(n + ' -->')
  }
  ch.close()
}).then(function() { console.log('Done1');});
