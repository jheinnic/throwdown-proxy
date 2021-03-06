var fs    = require('fs')
var chan  = require('chan')
var co    = require('co')
var split = require('split')

co(function *() {
  var ch = chan()

  fs.createReadStream(__dirname + '/lines.txt')
    .pipe(split())
    .on('data',  ch)
    .on('error', ch)
    .on('end',   ch.close)

  while (!ch.done()) {
    var val = yield ch
    if (val !== ch.empty) {
      console.log('Stream yielded: ' + String(yield ch))
    }
  }

  console.log('Stream ended')
})()
