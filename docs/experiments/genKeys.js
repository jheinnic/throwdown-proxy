"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var assert = require("assert");
// Generate Alice's keys...
exports.alice = crypto.createECDH('secp521r1');
exports.aliceKey = exports.alice.generateKeys();
// Generate Bob's keys...
exports.bob = crypto.createECDH('secp521r1');
exports.bobKey = exports.bob.generateKeys();
// Exchange and generate the secret...
exports.aliceSecret = exports.alice.computeSecret(exports.bobKey);
exports.bobSecret = exports.bob.computeSecret(exports.aliceKey);
exports.aliceSecretHex = exports.aliceSecret.toString('hex');
exports.bobSecretHex = exports.bobSecret.toString('hex');
assert.strictEqual(exports.aliceSecretHex, exports.bobSecretHex);
