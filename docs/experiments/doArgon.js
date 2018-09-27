const isNode = require('@thi.ng/checks/is-node').isNode;

const _iterCount = 10;
const _memSize = 2 ** 13;
const _parallelism = 2;
const _type = 'argon2id';
const ops = {
   hash: undefined,
   verify: undefined
};


if (isNode()) {
    const argon2 = require('argon2');
    const options =  {
        raw: true,
        timeCost: _iterCount,
        memoryCost: _memSize,
        parallelism: _parallelism,
        type: (_type === 'argon2id') ? argon2.argon2id : (_type === 'argon2i') ? argon2.argon2i : argon2d
   };

   ops.hash = async function(password) {
       try {
           const hash = await argon2.hash(password, options);
           return { hash };
       } catch (e) {
           return { err: e, message: e, code: -1 };
       }
   };

   ops.verify = async function(hash, password) {
       if (!! hash.err) {
           return {
               err: new Error('Orginal hash failed--cannot verify:',hash.err),
               message: 'Orginal hash failed--cannot verify: ' + hash.err,
               code: -1
           };
       }
       try {
            // const result = await argon2.verify(hash.hash, password);
            const result = true;
            return { result };
       } catch (e) {
            return { err: e, message: e, code: -1 };
       }
   };
} else {
    const argon2 = require('argon2-browser').argon2;
    console.log(argon2);

    const type = (_type === 'argon2id') ? argon2.ArgonType.Argon2d : (_type === 'argon2i') ? argon2.ArgonType.Argon2i : argon2.ArgonType.Argon2d;

    ops.hash = async function(password) {
        return await argon2.hash({
            // required
            pass: password,
            salt: 'salty',
            time: _iterCount, // the number of iterations
            mem: _memSize, // used memory, in KiB
            hashLen: 24, // desired hash length
            parallelism: _parallelism, // desired parallelism (will be computed in parallel only for PNaCl)
            type: type
        })
        .then(
            res => { res.hash, res.hashHex, res.enccoded }
        ).catch(function(err) {
            console.error('Caught', err);
            return { err,
               message: (!!err.message) ? err.message : 'message',
               code: (!!err.code) ? err.code : -1
            };
        });
    };

    ops.verify = async function(hash, password) {
        if (hash.err) { return hash; }

        checkPassword = await ops.hash(password);
        if (!! checkPassword.err) { return checkPassword; }

        const result = checkPassword.hashHex === hash.hashEx;
        return { result };
    }; 
}

async function runArgon2(ops, password) {
    const hash = await ops.hash(password);
    // console.log('Hash', hash);
    const result = await ops.verify(hash, password);
    // console.log(result);
    return result;
}

runArgon2(ops, 'this is my password').then(console.log).catch(console.error);

crypto = require('crypto');
const randomBytes = crypto.randomBytes(16);
const randomStr = randomBytes.base64Slice();
console.log('Random:', randomStr);
runArgon2(ops, randomStr).then(console.log).catch(console.error);

for( let ii=0; ii< 250; ii++ ) {
    runArgon2(ops, randomStr);
}

