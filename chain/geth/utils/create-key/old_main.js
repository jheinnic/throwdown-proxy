const scrypt = require("scrypt");
const createKeccakHash = require('keccak')

const program = require('commander');
const medium = require('medium');

const process = require('process');
const crypto = require('crypto');
const read = require('read');
const fs = require('fs');

const consoleChan = medium.chan();

program.arguments("<file>")
	.action(exportKey)
	.parse(process.argv);

read({
	prompt: 'password?',
	silent: true,
	replace: '*',
	input: process.stdin,
	output: process.stdout
}, function(err, data) {
	medium.go( async () => {
		await medium.put(consoleChan, data);
		console.log('Password received');
	});
});


function exportKey(filePath) {
	console.log(filePath);
	medium.go( async () => {
		let keyDefStr = await new Promise(
			(resolve, reject) => {
				try {
					fs.readFile(filePath, (err, data) => { resolve(data); });
				} catch( e ) {
					console.error('Failed to read ' + filePath, e);
					reject(e);
				}
			}
		);

		const keyDef = JSON.parse(keyDefStr);
		const keyCrypto = keyDef.crypto;
		if (keyCrypto.kdf !== 'scrypt' || keyCrypto.cipher !== 'aes-128-ctr') {
			console.error('This utility only knows how to extract keys defined wih scrypt and aes-128-ctr.');
			return;
		}
	
		const salt = Buffer.from(keyCrypto.kdfparams.salt, 'hex');
		const cipherText = Buffer.from(keyCrypto.ciphertext, 'hex');
		const mac = Buffer.from(keyCrypto.mac, 'hex');
		const iv = Buffer.from(keyCrypto.cipherparams.iv, 'hex');
		
		// Extract a derived key from password and salt
		const password = await consoleChan;
		const dk = scrypt.hashSync(password, {N:262144,p:1,r:8}, 32, salt);
		
		// Combine the last 16 bytes of the derived key with encrypted cipher text to get a SHA3 keccak-256 hash
		const preMac = new Buffer(48);
		dk.slice(16).copy(preMac);
		cipherText.copy(preMac, 16);
		const d = createKeccakHash('keccak256').update(preMac).digest();

		// Compare with MAC to verify password.  Remaining 16 bytes of passwor-derived key are the decryption key
		// for the cipher text.
		if (! d.equals(mac)) {
			console.error('Password test fails.  Expected =', mac.hexSlice(), '; Actual =', d.hexSlice());
			return;
		}
		
		const cipherKey = dk.slice(0, 16);
		const cipher = crypto.createCipheriv('aes-128-ctr', cipherKey, iv);
		const decrypted = Buffer.concat([cipher.update(cipherText), cipher.final()]);
		
		// Log the result and return.
		console.log(decrypted.toString('hex'));
	});
}
