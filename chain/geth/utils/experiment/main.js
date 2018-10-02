const keythereum = require('keythereum');
const program = require('commander');
const medium = require('medium');

const process = require('process');
const crypto = require('crypto');
const read = require('read');
const fs = require('fs');

const params = 
    program.arguments('<file>')
        .option('-k, --keystore <dataStoreDir>', './keystore')
        .option('-s, --secret [exportFile]')
        .parse(process.argv);

console.log(params);

read({
    prompt: 'Please input a password for encrypting the secret key: ',
    silent: true,
    replace: '*',
    input: process.stdin,
    output: process.stdout
}, function(err, data) {
    createKey(data);
});


function createKey(password) {
    var params = { keyBytes: 32, ivBytes: 16 };
    
    keythereum.create(params, function(derivedKey) {
        encryptKey(password, derivedKey);
    });
}

function encryptKey(password, derivedKey) {
    // Note: if options is unspecified, the values in keythereum.constants are used.
    var options = {
        kdf: 'scrypt',
        cipher: 'aes-128-ctr',
        kdfparams: {
            n: 262144,
            dklen: 32,
            p: 1,
            r: 8,
            prf: 'hmac-sha256'
        }
    };
    
    console.log('Dumping with hmca-sha256');
    keythereum.dump(password, derivedKey.privateKey, derivedKey.salt, derivedKey.iv, options, function(keyObject) {
        console.log('Ready to export encrypted key', keyObject)
	keythereum.exportToFile(keyObject, params.keystore, function() {
            console.log('Ready to export secret key', keyObject)
            if (!! params.secret) {
                keythereum.recover(password, keyObject, function(secretKey) {
        	    console.log('Exporting secret key', keyObject)
                    fs.writeFileSync(params.secret, secretKey.hexSlice());
	        });
            }
        });
    });
    
    console.log('Dumping with keccak-256');
    options.kdfparams.prf = 'keccak-256';
    keythereum.dump(password, derivedKey.privateKey, derivedKey.salt, derivedKey.iv, options, function(dataObject) {
	keythereum.exportToFile(keyObject, params.keystore);

        if (!! params.secret) {
            console.log('Ready to export secret key')
            keythereum.recover(password, keyObject, function(secretKey) {
        	console.log('Exporting secret key')
                fs.writeFileSync(params.secret + "_2", secretKey);
	    });
        }
    });
}
