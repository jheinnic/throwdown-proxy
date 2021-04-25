"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// @ts-ignore
var co_stream_1 = require("co-stream");
var index_1 = require("../../../src/infrastructure/randomize/sources/index");
var bs = require("binary-search");
var co_1 = require("co");
var trigrams = [];
var freqSum = [];
var prefixSum = 0;
function naturalOrder(element, needle) { return element - needle; }
co_1.co(function () {
    var input, reader, start, txt, tokens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = fs.createReadStream('../../english_trigrams.txt'), reader = new co_stream_1.cs.LineReader(input), start = Date.now();
                _a.label = 1;
            case 1: return [4 /*yield*/, reader.read()];
            case 2:
                if (!(typeof (txt = _a.sent()) === 'string')) return [3 /*break*/, 3];
                console.log('line', txt);
                tokens = txt.split(/ /);
                trigrams.push(tokens[0]);
                prefixSum += parseInt(tokens[1]);
                freqSum.push(prefixSum);
                return [3 /*break*/, 1];
            case 3:
                console.log('done. %d lines, %d ms.', prefixSum, Date.now() - start);
                return [2 /*return*/];
        }
    });
}).catch(function (err) {
    if (err)
        console.log(err);
})
    // const strm = fs.createReadStream('../../english_trigrams.txt')
    //    .pipe(cs.split())
    //    .pipe(cs.each(function* (line: string): IterableIterator<any> {
    //       console.log('line');
    //       const tokens = line.split(/ /);
    //       trigrams.push(tokens[0]);
    //       prefixSum += parseInt(tokens[1]);
    //       freqSum.push(prefixSum);
    //    }, {}));
    .then(function () {
    console.log('Fin!');
    var foo = new index_1.IsaacCSPRNG([93, 84, 891, 9227, 292, 19, 9283, 173, 842]);
    for (var ii = 0; ii < 1000; ii++) {
        var prefix = '';
        var suffix = '';
        for (var ii_1 = 0; ii_1 < 5; ii_1++) {
            var nextP = foo.int32() % prefixSum;
            var pIdx = bs(freqSum, nextP, naturalOrder);
            if (pIdx < 0) {
                pIdx = -1 * (pIdx + 1);
            }
            var nextS = foo.int32() % prefixSum;
            var sIdx = bs(freqSum, nextS, naturalOrder);
            if (sIdx < 0) {
                sIdx = -1 * (sIdx + 1);
            }
            prefix = prefix + trigrams[pIdx];
            suffix = suffix + trigrams[sIdx];
        }
        console.log(prefix + ' ' + suffix);
    }
    console.log(prefixSum);
    var length = trigrams.length;
    for (var ii = 0; ii < length; ii++) {
        fs.writeFileSync('trigram_prefix_sums.dat', trigrams[ii] + " " + freqSum[ii] + "\n");
    }
});
