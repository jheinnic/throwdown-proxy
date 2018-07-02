var Pairing = artifacts.require("Pairing");
var Wavelets02Verifier = artifacts.require("Wavelets02Verifier");
var Waldo02Verifier = artifacts.require("Waldo02Verifier");

module.exports = function(deployer) {
   deployer.deploy(Pairing);
   deployer.deploy(Wavelets02Verifier);
   deployer.deploy(Waldo02Verifier);
};

