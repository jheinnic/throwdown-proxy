const bn128Module = require('rustbn.js');

const ecAddPrecompile = bn128Module.cwrap('ec_add', 'string', ['string'])
var inputHexStr = '7bd9e3ac68341cf150bb42515b3485b96653b907ebd9c9254fc728f22a3b405a65110c09645ca36cbef7b30b7e501d22553e91fdecdcfa3d748d39dae9a95757'
let result = ecAddPrecompile(inputHexStr)

const ecMulPrecompile = bn128Module.cwrap('ec_mul', 'string', ['string'])
inputHexStr = '6653b907ebd9c9254fc728f22a3b405a65110c09645ca36cbef7b30b7e501d22553e91fdecdcfa3d748d39dae9a95757';
let result2 = ecMulPrecompile(inputHexStr)

const ecPairingPrecompile = bn128Module.cwrap('ec_pairing', 'string', ['string'])
inputHexStr = '7bd9e3ac68341cf150bb42515b3485b96653b907ebd9c9254fc728f22a3b405a';
let result3 = ecPairingPrecompile(inputHexStr)

console.log(result, result2, result3);

