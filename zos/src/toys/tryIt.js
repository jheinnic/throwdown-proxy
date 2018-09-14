"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require("bip39");
var hdkey = require("ethereumjs-wallet/hdkey");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var range_1 = require("rxjs/internal/observable/range");
var mnemonic = 'reward decide comfort submit reopen average surface surge harbor work stove holiday balcony adjust more come brass before snow afford labor vocal plate flash';
var hdRoot = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
var hashType = 'sha256';
var prizeDist = [
    {
        prizeTier: 11,
        prizeValue: 75000,
        prizeCount: 2
    },
    {
        prizeTier: 10,
        prizeValue: 5000,
        prizeCount: 16
    },
    {
        prizeTier: 9,
        prizeValue: 500,
        prizeCount: 480
    },
    {
        prizeTier: 8,
        prizeValue: 250,
        prizeCount: 790
    },
    {
        prizeTier: 7,
        prizeValue: 100,
        prizeCount: 4560
    },
    {
        prizeTier: 6,
        prizeValue: 50,
        prizeCount: 10735
    },
    {
        prizeTier: 5,
        prizeValue: 30,
        prizeCount: 14250
    },
    {
        prizeTier: 4,
        prizeValue: 20,
        prizeCount: 47500
    },
    {
        prizeTier: 3,
        prizeValue: 15,
        prizeCount: 95045
    },
    {
        prizeTier: 2,
        prizeValue: 10,
        prizeCount: 123500
    },
    {
        prizeTier: 1,
        prizeValue: 5,
        prizeCount: 190000
    }
];
var tempDistro = [
    {
        prizeTier: 2,
        prizeValue: 10,
        prizeCount: 480
    },
    {
        prizeTier: 1,
        prizeValue: 5,
        prizeCount: 16
    }
].reverse();
var noWinCount = 1413127;
var hasWinCount = tempDistro.reduce(function (agg, item) {
    return agg + item.prizeCount;
}, 0);
var allWinnersSource = rxjs_1.from(tempDistro, rxjs_1.asyncScheduler).pipe(operators_1.flatMap(function (prizeDist) {
    return range_1.range(1, prizeDist.prizeCount).pipe(operators_1.map(function (tierIndex) { return Object.assign({ tierIndex: tierIndex }, prizeDist); }));
}), operators_1.shareReplay(tempDistro.length));
;
// const anyWinnerCounterSource = range(0, hasWinCount);
var secondChanceCounterSource = range_1.range(0, noWinCount);
var allTicketsCounterSource = range_1.range(0, noWinCount + hasWinCount);
distroSource.pipe(prizeAddress =
);
return Object.assign({ tieredPrizeIndex: tieredPrizeIndex, prizeAddress: prizeAddress }, prizeDist);
// No longer secret shared secret ;-)
var sharedSecret = 'super-secret';
var query = 'key=value';
var hmac = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(sharedSecret), sjcl.hash.sha256);
var signature = sjcl.codec.hex.fromBits(hmac.encrypt(query));
return [query, signature];
return range_1.range(0, prizeDist.prizeCount)
    .pipe(operators_1.map(function (prizeIndex) {
    return {
        prizeTier: prizeDist.prizeTier,
        prizeValue: prizeDist.prizeValue,
        prizeAddress: 
    };
}));
s;
subscribe(function (sigPair) {
}, tempDistro.map(function (prizeTier) {
    for (var ii = 0; ii < prizeTier.prizeCount; ii++) {
    }
}));
