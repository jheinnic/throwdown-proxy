"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const lib_1 = require("./lib");
const bignumber_js_1 = require("bignumber.js");
const crypto = require("crypto");
const global = require("global");
// Local Geth chain deployment
const CONTRACT_ADDRESS = '0x3897e50db3d621285ac21f09b1079c25d3edb7f3';
// Local and ephemeral Ganache chain deployment
// const CONTRACT_ADDRESS = '0xddc43349b4b467e7a157a577e8b7fc6180d7e35f';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const a = [
    new bignumber_js_1.default("0x77afb497b653d10027eda567cea684f517b3949da6df1e8efb368c98bdcceca"),
    new bignumber_js_1.default("0x24d6592ce34042da5545b8d4759077b7330f73a87c198553f4fe32fc1a7e490")
];
const a_p = [
    new bignumber_js_1.default("0x916b28299053a6956198cb8dc0b38fbdbeae972d147db213e3b4cfb52b16fa5"),
    new bignumber_js_1.default("0xf28462d6dc70dd47882d561a07ed4bef83548581cf5a312d9d875a7505087d8")
];
const b = [
    [
        new bignumber_js_1.default("0x9c0413080d4970d47bb00c15d59bc883058ccd105c81b1036415f82be233035"),
        new bignumber_js_1.default("0x2df3441b08abf4d0f8b61187938c0a3a85287c1a10e5ec394bae6cf31fd7aae1")
    ], [
        new bignumber_js_1.default("0x2c04165ff0027c8720050c1d3cfd28c410d44671766d4fa8286d727180161a8b"),
        new bignumber_js_1.default("0x7ca03ad6c3eb19d8ca5bcf316b4b4f2439ece417a9165087a51e5577a2f7213")
    ]
];
const b_p = [
    new bignumber_js_1.default("0x22b3243bb6fe35c138e9664946fc55933820732a69b08c7ceb438696ad592dd3"),
    new bignumber_js_1.default("0x27ea603225b68a4b69e66a0b64866212a014d8de12bfabbbe7d1d865e4e909e5")
];
const c = [
    new bignumber_js_1.default("0x24c159356a7cbdb5fbd98fb6e59fdf25fef496c31165dd5c6871e003e8f83cd4"),
    new bignumber_js_1.default("0x1091c7b5d80252b3ebb9bf24489f4d1328f93f80f80c52ada65468fbb4619dd0")
];
const c_p = [
    new bignumber_js_1.default("0x9aca061c465e644571e9dc39bf3bffaea1f9999d08d3f3465c3fc0dcad5a9c6"),
    new bignumber_js_1.default("0x185ee5e11fe61f65f99f71bb782040dba7213923fe67d4893a653fc1201409eb")
];
const h = [
    new bignumber_js_1.default("0x966740e9d5dcaa1869b36b9708e5a22a72724dc1c5556ca389dcd2b8c52643"),
    new bignumber_js_1.default("0x1392fd1d72a656e0614b91f25b4994b8e1cd4a4f69321c1851011688864bb3b7")
];
const k = [
    new bignumber_js_1.default("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70"),
    new bignumber_js_1.default("0x2e91deb8e63c78767e097728fd07b244109f13ee622b1063d7b937cdd1b56ce8")
];
const input = [new bignumber_js_1.default(7), new bignumber_js_1.default(99), new bignumber_js_1.default(4), new bignumber_js_1.default(396 /*2772*/)];


// p == '2.1888242871839275222246405745257275088696311157297823662689037894645226208583e+76';
let config = bignumber_js_1.default.config();
config.ERRORS = true;
config.CRYPTO = true;
config.DECIMAL_PLACES = 0;
config.ROUNDING_MODE = 4; // RoundingMode.ROUND_HALF_UP;
config.MODULO_MODE = 9; // RoundingMode.EUCLID;
config.EXPONENTIAL_AT = [-7, 80];
config.RANGE = [-7, 152];
config.POW_PRECISION = 0;
config.FORMAT = {};
// let swap = global.crypto;
global.crypto = crypto;
bignumber_js_1.default.config(config);
// global.crypto = swap;
// console.log(new BigNumber("21888242871839275222246405745257275088696311157297823662689037894645226208583"));
// console.log(new BigNumber("21888242871839275222246405745257275088696311157297823662689037894645226208583").toFormat());
// console.log(new BigNumber("21888242871839275222246405745257275088696311157297823662689037894645226208583").toString());
// console.log(new BigNumber("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70"));
// console.log(new BigNumber("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70").toFormat());
// console.log(new BigNumber("0x2ea859fc74b36db43dbac9026aa062ff6e5eba30dd02342d40dddde431d46c70").toString());
// console.log(BigNumber.random(100));
lib_1.Verifier.createAndValidate(web3, CONTRACT_ADDRESS)
    .then((v) => {
    v.VerifiedEvent.bind(this, (...args) => {
        console.log('On VerifiedEvent:', args);
    });
    const ethTxParams = {
        from: web3.personal.listAccounts[1],
        gas: 1.7e7,
        gasPrice: 8e4
    };
    const txPromise = v.verifyTxTx(a, a_p, b, b_p, c, c_p, h, k, input).send(ethTxParams);
    txPromise.then((result) => {
        console.log(`The query returned ${result}`);
    }, (err) => {
        console.error(`The query fell on its face with ${err}`);
    });
}).catch(err => { console.error(err); });
//# sourceMappingURL=verifier-demo.js.map
