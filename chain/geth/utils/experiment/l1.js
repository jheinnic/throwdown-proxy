var co = require('co');
// var wait = require('co-wait');
var limiter = require('co-limiter');

var limit = limiter(3);

function wait(ms, value) {
  return function (done) {
    function doSomething() {
      done(value);
    }

    setTimeout(doSomething, ms);
  }
}

function doElse(done) {
  done('else');
}

var job = function *() {
  // yield wait(1000)(function() { return function() { return 'something'; }; } )
  yield doElse;
  console.log('Doing something...');
  // yield wait(1000, 'something');
}

for (var i = 0; i < 10; i++) {
  co(function *() {
    yield limit(job());
  }).then(function(val) {
    console.log(val);
  }).catch(function(err) {
    console.error(err);
  });
}
