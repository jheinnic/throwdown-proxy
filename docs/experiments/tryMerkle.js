var fs = require('fs');
var util = require('util');
var crypto = require('crypto');
var merkle = require('merkle');
var es = require('event-stream');

var words = new Array(100).fill(0);
for (let ii = 0; ii < 100; ii++) {
   words[ii] = crypto.randomBytes(8).hexSlice();
}
words = words.sort().map((item) => Buffer.from(item, 'hex'));

// Stream style -- streams json tree
var es = require('event-stream');
var merkleFile  = merkle('sha256', false).json();
// var merkleAsync = merkle('sha256', false).async(onTreeDone);

merkleFile
  .pipe(es.stringify())
//   .pipe(process.stdout);
  .pipe(fs.createWriteStream('tree.json'));
 
words.forEach(function(word){
    merkleFile.write(word);
});
 
merkleFile.end();

// let tree = merkle('sha256', false).sync(words);
// console.log(tree.root());
// console.log(tree.levels());
