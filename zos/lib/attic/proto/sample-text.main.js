"use strict";
exports.__esModule = true;
var freqs = [0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150, 0.01974, 0.00074];
var alpha = 'abcdefghijklmnopqrstuvwxyz';
var counts = freqs.map(function (val) { return Math.round(val * 255); });
console.log(counts);
var mixStr = '';
for (var ii = 0; ii < 26; ii++) {
    var letter = alpha[ii];
    var count = counts[ii];
    mixStr = mixStr + letter.repeat(count);
}
console.log(alpha);
console.log(counts);
console.log(mixStr);
var mathjs = require("mathjs");
var distLen = mixStr.length;
var mixDist = new Array(256);
console.log(distLen);
for (var ii = 0; ii < distLen; ii++) {
    mixDist[ii] = mixStr[ii];
}
mixDist[253] = alpha[Math.round(mathjs.random(0, 25))];
mixDist[254] = alpha[Math.round(mathjs.random(0, 25))];
mixDist[255] = alpha[Math.round(mathjs.random(0, 25))];
// console.log(mixDist);
var swap;
for (var ii = 0; ii < distLen; ii++) {
    var target = Math.round(mathjs.random(ii, distLen));
    if (target != ii) {
        console.log(mixDist[ii], mixDist[target]);
        swap = mixDist[ii];
        mixDist[ii] = mixDist[target];
        mixDist[target] = swap;
    }
    if (mathjs.random(0, 1) < 0.25) {
        mixDist[ii] = mixDist[ii].toUpperCase();
    }
}
console.log(mixDist.join(''));
// console.log(mixDist.join(''));
