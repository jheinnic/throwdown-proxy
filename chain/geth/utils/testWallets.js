const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const utils = require('ethereumjs-util');
const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');

function Blockchain(opts) {
  if (! opts) { opts = {}; }

  // this.rng = seedrandom(opts.seed);
  if (!! opts.mnemonic) {
    this.mnemonic = opts.mnemonic;
  } else {
    this.mnemonic = this.mnemonic || bip39.entropyToMnemonic(crypto.randomBytes(16, this.rng));
  }

  this.wallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(this.mnemonic));
  this.wallet_hdpath = "m/44'/60'/0'/0/";
  this.accounts = [];
}
 	 
Blockchain.prototype.addAccount = function(opts, callback) {
  var self = this;
 
  if (!!opts && !!opts.secretKey) {
    this.secretKey = opts.secretKey;
  } else {
    var index = Object.keys(this.accounts).length;
    var account = this.wallet.derivePath(this.wallet_hdpath + index) // index is a number
    secretKey = account.getWallet().getPrivateKey() // Buffer
  }

  var publicKey = utils.privateToPublic(new Buffer(secretKey));
  var address = utils.pubToAddress(new Buffer(publicKey));

  this.accounts.push({
    publicKey: publicKey.hexSlice(),
    secretKey: secretKey.hexSlice(),
    address: address.hexSlice()
  });
}

Blockchain.prototype.displayAccounts = function() {
  console.log(util.inspect(this.accounts));
}

Blockchain.prototype.writeTestBalances = function() {
  const addresses = [];
  const balances = {};
  const keys = {};
  const dataSet = { addresses, balances, keys };
  this.accounts.map(
    function(acct) {
      addresses.push(acct.address);
      balances[acct.address] = {
        "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
      };
      keys[acct.address] = {
        "public": acct.publicKey,
        "secret": acct.secretKey
      };
    }
  );

  // const fileName = this.mnemonic.replace(' ', '_') + '.dat';
  const fileName = this.mnemonic + '.dat';
  fs.writeFileSync(
    path.join('testWallets', fileName),
    util.inspect(dataSet)
  );
}

Blockchain.prototype.genTestWallet = function(size) {
  const createCount = size - this.accounts.length;
  for( let ii=0; ii<createCount; ii++ ) {
    this.addAccount();
  }
  this.writeTestBalances();
}

const b3 = new Blockchain({
  mnemonic: 'say slight close trip refuse seven marble fun edge galaxy cash pioneer'
});
b3.genTestWallet(25);

for(let ii=0; ii<5; ii++) {
  const b = new Blockchain();
  b.genTestWallet(25);
}

/*
console.log(b.mnemonic);
b.displayAccounts();
console.log(b2.mnemonic);
b2.displayAccounts();
console.log(b3.mnemonic);
b3.displayAccounts();
*/

