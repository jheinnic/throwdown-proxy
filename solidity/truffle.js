require("babel-register")({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require("babel-polyfill");

var HDWalletProvider = require("truffle-hdwallet-provider");
require("process");

// 12-word mnemonic
var mnemonic = process.env.SOLIDITY_PUBLISH_MNEMONIC || "opinion destroy betray opinion destroy betray opinion destroy betray opinion destroy betray";

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8501,
            network_id: "*", // Match any network id
            gas: 7e6,
            gasPrice: 2e10
        },
        ropsten: {
          provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
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
