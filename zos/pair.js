const co = require('co');

co(function* () {
  var result = yield Promise.resolve(false);
  result = yield Promise.resolve(true);
  result = yield Promise.resolve(true);

  // return result;
}).then(function (value) {
  console.log(value);
}, function (err) {
  console.error(err.stack);
});

