var co = require('co');
var wait = require('co-wait');
var limiter = require('co-limiter');
var Queue = require('co-priority-queue');

var limiter = function(concurrency) {
  var queue = new Queue();

  // Create consumers
  for (var i = 0; i < concurrency; i++) {
    co(function *() {
      var yieldable;
      while (true) {
        yieldable = yield queue.next();
	yield co(yieldable);
      }
    }).catch(function(err) {
      console.error(err.stack);
    });
  }

  var limit = function(generator, priority) {
    return function(cb) {
      const wrapped = co.wrap(generator);
      console.log('pushing', wrapped);
      queue.push(function () {
	console.log('pushed runs');
	wrapped().then(function(value) {
          cb(undefined, value);
	}).catch(cb);
      }, priority);
    };
  };

  var limit2 = function(generator, priority) {
    return function(cb) {
      const wrapped = co.wrap(generator);
      queue.push(function* () {
	try {
          cb(undefined, yield wrapped());
	} catch(err) {
          cb(err);
        }
        
	return;
      }, priority);
    };
  };

  return limit2;
};

var limit = limiter(3);

function wait2(ms, value) {
  return function (done) {
    function doSomething() {
      done(undefined, value);
    }

    setTimeout(doSomething, ms);
  }
}

function* job() {
  console.log('Doing something...');
  yield wait(1000);
  return 5;
}

co(function* () {
  const retVal = [];
  for (var i = 0; i < 10; i++) {
    retVal.push(limit(job));
  }
  retVal.push(limit(job));

  return yield retVal;
}).then(console.log);
