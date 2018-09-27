const SHA3 = require('sha3');
const crypto = require('crypto');
const createKeccakHash = require('keccak')
const scrypt = require("scrypt");
const program = require('commander');
const read = require('read');
const medium = require('medium');
const process = require('process');
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
					console.error(e);
					reject(e);
				}
			}
		);
		// let keyDefStr = await keyDefPromise;

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
		
		const password = await consoleChan;
		const dk = scrypt.hashSync(password, {N:262144,p:1,r:8}, 32, salt);
		console.log(dk);
		
		const preMac = new Buffer(48);
		dk.slice(16).copy(preMac);
		cipherText.copy(preMac, 16);
		console.log(preMac);
		
		// Generate 256-bit digest.
		// let d = new SHA3.SHA3Hash(256);
		// d.update(preMac);
		// macDigest = d.digest('hex');
		
		// console.log(macStr);
		// console.log(macDigest);
		
		const d = createKeccakHash('keccak256').update(preMac).digest();
		if (! d.equals(mac)) {
			console.error('mac test fails.  Expected =', mac.hexSlice(), '; Actual =', d.hexSlice());
			return;
		}
		// console.log(d.toString('hex'))
		// console.log(d);
		
		const cipherKey = dk.slice(0, 16);
		// console.log(cipherKey, cipherKey.length);
		const cipher = crypto.createCipheriv('aes-128-ctr', cipherKey, iv);
		const decrypted = Buffer.concat([cipher.update(cipherText), cipher.final()]);
		
		console.log(decrypted.toString('hex'));
	});
}
