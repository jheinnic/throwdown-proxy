var EC = require('elliptic').ec;
var ec = new EC('curve25519');


// Generate keys
var key1 = ec.genKeyPair();
var key2 = ec.genKeyPair();

var shared1 = key1.derive(key2.getPublic());
var shared2 = key2.derive(key1.getPublic());

console.log('Both shared secrets are BN instances');
console.log(shared1.toString(16));
console.log(shared2.toString(16));

// Generlized form of 2 keys

var altShared1 = key2.getPublic().mul(key1.getPrivate()).getX();
var altShared2 = key1.getPublic().mul(key2.getPrivate()).getX();

console.log('Both shared secrets are BN instances');
console.log(altShared1.toString(16));
console.log(altShared2.toString(16));

// Generalized form for 3 keys

var A = ec.genKeyPair();
var B = ec.genKeyPair();
var C = ec.genKeyPair();

var AB = A.getPublic().mul(B.getPrivate());
var BC = B.getPublic().mul(C.getPrivate());
var CA = C.getPublic().mul(A.getPrivate());

var ABC = AB.mul(C.getPrivate());
var BCA = BC.mul(A.getPrivate());
var CAB = CA.mul(B.getPrivate());

console.log('All three secrets are BN instances');
console.log(ABC.getX().toString(16));
console.log(BCA.getX().toString(16));
console.log(CAB.getX().toString(16));

// Equivalent using derive...
var dABC = C.derive(AB);
var dBCA = A.derive(BC);
var dCAB = B.derive(CA);

console.log('All three secrets are BN instances');
console.log(dABC.toString(16))
console.log(dBCA.toString(16))
console.log(dCAB.toString(16))

var d2ABC = C.derive(A.getPublic().mul(B.getPrivate()));
var d2BCA = A.derive(B.getPublic().mul(C.getPrivate()));
var d2CAB = B.derive(C.getPublic().mul(A.getPrivate()));

console.log('All three secrets are BN instances');
console.log(d2ABC.toString(16))
console.log(d2BCA.toString(16))
console.log(d2CAB.toString(16))

// Attempt extension to four keys...
var D = ec.genKeyPair();

var ABCD = D.derive(A.getPublic().mul(B.getPrivate()).mul(C.getPrivate()));
var BCDA = A.derive(B.getPublic().mul(C.getPrivate()).mul(D.getPrivate()));
var CDAB = B.derive(C.getPublic().mul(D.getPrivate()).mul(A.getPrivate()));
var DABC = C.derive(D.getPublic().mul(A.getPrivate()).mul(B.getPrivate()));

console.log('All four secrets are BN instances');
console.log(ABCD.toString(16))
console.log(BCDA.toString(16))
console.log(CDAB.toString(16))
console.log(DABC.toString(16))


var ABCD2 = D.derive(A.getPublic().mul(C.getPrivate()).mul(B.getPrivate()));
var BCDA2 = A.derive(B.getPublic().mul(C.getPrivate()).mul(D.getPrivate()));
var CDAB2 = B.derive(C.getPublic().mul(A.getPrivate()).mul(D.getPrivate()));
var DABC2 = C.derive(D.getPublic().mul(A.getPrivate()).mul(B.getPrivate()));

console.log('All four secrets are BN instances');
console.log(ABCD2.toString(16))
console.log(BCDA2.toString(16))
console.log(CDAB2.toString(16))
console.log(DABC2.toString(16))
