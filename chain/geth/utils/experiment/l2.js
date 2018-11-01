var co = require('co');
var wait1 = require('co-wait');
var limiter = require('co-limiter');

var limit = limiter(3);

function wait(ms, value) {
  return function (done) {
    function doSomething() {
      done(undefined, value);
    }

    setTimeout(doSomething, ms);
  }
}

function doElse(done) {
  done(undefined, 'else');
}

var job = function *() {
  yield wait1(1000);
  console.log('Doing something...');
  yield doElse;
  yield wait(1000, 'something');
  yield Promise.resolve('zoo');
}

co(function *() {
  var limit = limiter(3);

  for (var i = 0; i < 10; i++) {
    co(function*() {
      yield limit(job());
    });
  }
}).then(function(val) {
  console.log(val);
}).catch(function(err) {
  console.error(err);
});

wait1(5000)(console.log);
