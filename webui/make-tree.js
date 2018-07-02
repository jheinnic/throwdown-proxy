var Trie = require('merkle-patricia-tree'),
  rlp = require('rlp'),
  levelup = require('levelup');

var db = levelup('/home/null/.ethereum/state');
var root = "12582945fc5ad12c3e7b67c4fc37a68fc0d52d995bb7f7291ff41a2739a7ca16"
var trie = new Trie(db, root);
