const SHA3 = require('sha3');
const crypto = require('crypto');
const createKeccakHash = require('keccak')
const scrypt = require("scrypt");
const scryptParameters = scrypt.paramsSync(0.1);

var kdfResult = scrypt.kdfSync("", scryptParameters);
console.log(kdfResult);

var salt = Buffer.from("b8a6e236f91d18d040cc611054c5b5ed1ac26dfa2c94ba2654403e4dabfa5ff2", "hex");
var cipherText = Buffer.from("5fe3436c3cea6daeb0debfe218f5eb3dd4b442d1dcb790e65014899393d4fa42", "hex");
var macStr = "b77274454bf2146bccf724690033f8429faf242de1e0f22df40988c17e8785fe";
var mac = Buffer.from(macStr, "hex");
var iv = Buffer.from("835fefec7c0566abec6c638a772e9202", "hex");

var dk = scrypt.hashSync("abcd1234", {N:262144,p:1,r:8}, 32, salt);
console.log(dk);

var preMac = new Buffer(48);
dk.slice(16).copy(preMac);
cipherText.copy(preMac, 16);
console.log(preMac);

// Generate 256-bit digest.
let d = new SHA3.SHA3Hash(256);
d.update(preMac);
macDigest = d.digest('hex');

console.log(macStr);
console.log(macDigest);

d = createKeccakHash('keccak256').update(preMac).digest();
console.log(d.toString('hex'))
console.log(d);

var cipherKey = dk.slice(0, 16);
console.log(cipherKey, cipherKey.length);
var cipher = crypto.createCipheriv('aes-128-ctr', cipherKey, iv);
var decrypted = Buffer.concat([cipher.update(cipherText), cipher.final()]);

console.log(decrypted.toString('hex'));

