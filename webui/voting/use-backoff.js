'use strict';

const backoff = require('backoff');

let goal = 100;

function doThis(param1, param2, callback)
{
  console.log(param1, param2, goal);
  if (param1 > param2) {
    if (param1 === goal) {
      callback(undefined, param2);
    } else {
      goal = goal - 1;
      callback(param1);
    }
  }
}

const call = backoff.call(doThis, 5, 4, function (err, res) {
  console.log('Num retries: ' + call.getNumRetries());

  if (err) {
    console.log('Error: ' + err);
  } else {
    console.log('Status: ' + res);
  }
});

call.retryIf(function (err) {
  console.log('Retry if: ', err);
  return (err > 3);
});
call.setStrategy(new backoff.ExponentialStrategy({
  initialDelay: 10,
  maxDelay: 45000,
  randomisationFactor: 0.3,
  factor: 1.5
}));
// call.failAfter(5);
call.on('backoff', function(count, retryIn) {
  console.log('backoff', count, retryIn);
});

call.start();
