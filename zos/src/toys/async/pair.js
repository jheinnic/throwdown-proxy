const co = require('co');

const p1 = co(function* () {
  var result = yield Promise.resolve(true);
  console.log('yielded', result);
  result = yield Promise.resolve(true);
   console.log('yielded again', result);
  result = yield Promise.resolve(true);

  return result;
}).then(function (value) {
  console.log('log', value);
}, function (err) {
  console.error('err', err.stack);
});

console.log(p1);

const p2 = co(function* () {
   var result = yield Promise.resolve(false);
   console.log('yielded', result);
   result = yield p1;
   console.log('yielded again', result);
   result = yield Promise.resolve(false);
 
   return result;
}).then(function (value) {
   console.log('log', value);
}, function (err) {
   console.error('err', err.stack);
});
