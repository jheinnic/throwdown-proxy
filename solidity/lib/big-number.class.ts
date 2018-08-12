import BigNumber, {Configuration} from 'bignumber.js';
export * from 'bignumber.js';

let config: Configuration = BigNumber.config();
config.ERRORS = true;
config.DECIMAL_PLACES = 0;
config.ROUNDING_MODE = 4; // RoundingMode.ROUND_HALF_UP;
config.MODULO_MODE = 9; // RoundingMode.EUCLID;
config.EXPONENTIAL_AT = [-1, 80];
config.RANGE = [-1, 152];
config.POW_PRECISION = 0;
config.FORMAT = {
   // the decimal separator
   // decimalSeparator: '.',
   // the grouping separator of the integer part
   // groupSeparator: ',',
   // the primary grouping size of the integer part
   // groupSize: 3,
   // the secondary grouping size of the integer part
   // secondaryGroupSize: 0,
   // the grouping separator of the fraction part
   // fractionGroupSeparator: ' ',
   // the grouping size of the fraction part
   // fractionGroupSize: 0
};

const REQUIRE_CRYPTO_STRENGTH_PRNG_IN_BIG_NUMBER = false;

if( REQUIRE_CRYPTO_STRENGTH_PRNG_IN_BIG_NUMBER ) {
   const crypto = require("crypto");
   global['crypto'] = crypto;
   config.CRYPTO = true;
}

BigNumber.config(config);

// console.log(BigNumber.random(100));
// p == '2.1888242871839275222246405745257275088696311157297823662689037894645226208583e+76';
// console.log(new
// BigNumber("21888242871839275222246405745257275088696311157297823662689037894645226208583"));
// console.log(new
// BigNumber("21888242871839275222246405745257275088696311157297823662689037894645226208583").toFormat());
// console.log(new
// BigNumber("21888242871839275222246405745257275088696311157297823662689037894645226208583").toString());
// console.log(new BigNumber("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70"));
// console.log(new
// BigNumber("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70").toFormat());
// console.log(new
// BigNumber("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70").toString());
