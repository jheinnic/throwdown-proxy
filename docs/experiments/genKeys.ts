import * as crypto from 'crypto';
import * as assert from 'assert';

// Generate Alice's keys...
export const alice = crypto.createECDH('secp521r1');
export const aliceKey = alice.generateKeys();

// Generate Bob's keys...
export const bob = crypto.createECDH('secp521r1');
export const bobKey = bob.generateKeys();

// Exchange and generate the secret...
export const aliceSecret = alice.computeSecret(bobKey);
export const bobSecret = bob.computeSecret(aliceKey);

export const aliceSecretHex = aliceSecret.toString('hex');
export const bobSecretHex = bobSecret.toString('hex');

assert.strictEqual(aliceSecretHex, bobSecretHex);


