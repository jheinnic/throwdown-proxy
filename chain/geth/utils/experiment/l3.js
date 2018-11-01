var co = require('co');
var wait = require('co-wait');
var limiter = require('co-limiter');

var limit = limiter(2);

function wait2(ms, value) {
  return function (done) {
    function doSomething() {
      done(undefined, value);
    }

    setTimeout(doSomething, ms);
  }
}

var job = function *() {
  console.log('Doing something...');
  yield wait2(1000, 1000);
  // console.log('Doing foo...');
  //  yield { foo: 'bar' };
  // console.log('Doing five...');
  return 5;
}

co(function* () {
  for (var i = 0; i < 10; i++) {
    yield limit(job());
  }
  yield limit(job());
}).then(console.log);
