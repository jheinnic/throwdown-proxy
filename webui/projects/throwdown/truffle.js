require("babel-register")({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require("babel-polyfill");

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8501,
            network_id: "1528001646420", // Match any network id
            gas: 7e6,
            gasPrice: 2e10
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
