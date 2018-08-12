require("babel-register")({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require("babel-polyfill");

console.log('Pre Wallet');
// var HDWalletProvider = require("truffle-hdwallet-provider");
console.log('Load Wallet');
require("process");

// 12-word mnemonic
var mnemonic = process.env.SOLIDITY_PUBLISH_MNEMONIC || "opinion destroy betray opinion destroy betray opinion destroy betray opinion destroy betray";

console.log('Before export');
module.exports = {
    networks: {
        ganache_dev: {
            host: "localhost",
            port: 8501,
            network_id: "*", // Match any network id
            gas: 0x47e7c4,
            gasPrice: 2e6
        },
        development: {
            host: "localhost",
            port: 8546,
            network_id: "3378010", // Match any network id
            from: '0x13b285a259f914f257ee899e67bdb5f4171134a7',
            gasPrice: 2e4,
            gas: 0x47e7c4
        },
        ropsten: {
             provider: function() {
		return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/");
             },
          network_id: 3 // official id of the ropsten network
        }
    },
    solc: {
        // Turns on the Solidity optimizer. For development the optimizer's
        // quite helpful, just remember to be careful, and potentially turn it
        // off, for live deployment and/or audit time. For more information,
        // see the Truffle 4.0.0 release notes.
        //
        // https://github.com/trufflesuite/truffle/releases/tag/v4.0.0
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
console.log('After export');
