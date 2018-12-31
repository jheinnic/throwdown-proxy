// jshint esnext:true

var request = require('superagent')
var chan    = require('chan')
var co      = require('co')
var wait    = require('co-wait')

var urls = [
  'http://google.com',
  'http://medium.com',
  'http://segment.io',
  'http://cloudup.com',
  'http://github.com'
]

var ch = chan(3) // buffer size 3

co(function *() {
  for (var i = 0, l = urls.length; i < l; i++) {
    yield ch.async(request.get, urls[i])
    console.log('Response added to channel for: ' + urls[i])
  }
  ch.close()
}).then(function() { console.log('Done1'); });

co(function *() {
  while (!ch.done()) {
    yield ch
    yield wait(1000)
    console.log('Channel yielded')
  }
}).then(function() { console.log('Done1'); });
