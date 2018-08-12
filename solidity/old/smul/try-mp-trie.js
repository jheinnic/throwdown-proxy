var Trie = require('merkle-patricia-tree'),
levelup = require('levelup'),
db = levelup('./testdb'),
trie = new Trie(db); 

trie.put('test', 'one', function () {
  trie.get('test', function (err, value) {
    if(value) console.log(value.toString())
  });
});

## Merkle Proofs
Trie.prove(trie, 'test', function (err, prove) {
  if (err) return cb(err)
  Trie.verifyProof(trie.root, 'test', prove, function (err, value) {
    if (err) return cb(err)
    console.log(prove.toString, '=>', value.toString())
    cb();
  }
}

