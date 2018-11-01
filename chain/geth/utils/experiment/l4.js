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
	console.log(yieldable);
	yieldable();
        // yield co(yieldable);
      }
    }).catch(function(err) {
      console.error(err.stack);
    });
  }

  var limit = function(generator, priority) {
    return function(cb) {
      console.log('pushing', generator);
      queue.push(function () {
	console.log('pushed runs');
        // try {
	      console.log(generator);
	  co.wrap(generator)().then(function(value) {
		  cb(undefined, value);
	  }).catch(cb);
	  // return r;
        // } catch (err) {
          // cb(err);
          // return err;
        //}
      }, priority);
    };
  };

  return limit;
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

var job = function *() {
  console.log('Doing something...');
  return yield wait2(1000, 1000);
}

co(function* () {
  const retVal = [];
  for (var i = 0; i < 3; i++) {
    retVal.push(limit(co.wrap(job)));
  }
  retVal.push(limit(job));
  return retVal;
}).then(console.log);
