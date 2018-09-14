"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var bitstream_1 = require("@thi.ng/bitstream");
var isaac_csprng_class_1 = require("./isaac-csprng.class");
var INT31_OVERFLOW = Math.pow(2, 32);
function ToUint32(x) {
    return x - (Math.floor(x / INT31_OVERFLOW) * INT31_OVERFLOW);
}
var NodeCryptoRandomSource = /** @class */ (function () {
    function NodeCryptoRandomSource() {
    }
    NodeCryptoRandomSource.prototype.withPseudoRandomBuffer = function (seedSource, byteCount) {
        return function (source) {
            return source.pipe(
            // observeOn(queueScheduler),
            operators_1.withLatestFrom(seedSource.pipe(operators_1.switchMap(
            // Until seedSource emits a new Buffer, produce a stream of Buffers
            // derived from an ISAAC PRNG seeded with most recent seed buffer.
            function (seedBytes) {
                var writeBuf = new bitstream_1.BitOutputStream();
                writeBuf.writeWords(seedBytes, 8);
                var readBuf = writeBuf.reader();
                var wordCount = (seedBytes.length - seedBytes.length % 4) / 4;
                var words = readBuf.readWords(wordCount, 32);
                var generator = new isaac_csprng_class_1.IsaacCSPRNG(words);
                // console.log(generator);
                writeBuf = new bitstream_1.BitOutputStream(4);
                writeBuf.write(generator.int32(), 32);
                readBuf = writeBuf.reader();
                return rxjs_1.generate({
                    initialState: {
                        generator: generator,
                        writeBuf: writeBuf,
                        readBuf: readBuf
                    },
                    iterate: function (state) {
                        if (state.readBuf.position >= 32) {
                            readBuf.seek(0);
                            writeBuf.seek(0);
                            writeBuf.write(generator.int32(), 32);
                            // console.log(writeBuf, generator.accumulator, generator.count, generator.counter);
                        }
                        return state;
                    },
                    resultSelector: function (state) {
                        var retVal = state.readBuf.read(8);
                        // console.log(retVal, state.readBuf);
                        return retVal;
                    }
                    // scheduler: queueScheduler
                }).pipe(operators_1.tap(function (byte) { console.log(byte); }), operators_1.bufferCount(byteCount), operators_1.map(function (bytes) {
                    return Buffer.from(bytes);
                }));
            }))));
        };
    };
    NodeCryptoRandomSource.prototype.withPseudoRandomInteger = function (seedSource, minValue, maxValue) {
        if (minValue >= maxValue) {
            throw new Error("maxValue, " + maxValue + ", must be at least one greater than minValue, " + minValue);
        }
        var range = maxValue - minValue;
        if (range > (INT31_OVERFLOW - 1)) {
            throw new Error("Can only ensure integers over a range no greater than " + (INT31_OVERFLOW - 1) + " wide, which excludes " + range);
        }
        var offset = minValue - 1;
        return function (source) {
            return source.pipe(operators_1.observeOn(rxjs_1.queueScheduler), operators_1.withLatestFrom(seedSource.pipe(operators_1.map(
            // Transform each seed Buffer into an ISAAC PRNG.
            function (seedBytes) {
                var wordCount = (seedBytes.length - seedBytes.length % 4) / 4;
                var writeBuf = new bitstream_1.BitOutputStream();
                var readBuf = writeBuf.reader();
                writeBuf.writeWords(seedBytes, 8);
                var words = readBuf.readWords(wordCount, 32);
                return new isaac_csprng_class_1.IsaacCSPRNG(words);
            }))), operators_1.map(function (pair) {
                var nextResult = pair[1].int32();
                while (nextResult === 0) {
                    // Discard 0 since every other number can occur twice due to two's
                    // complement handling.
                    console.warn("Discarding generated 0 to avoid bias against minValue");
                    nextResult = pair[1].int32();
                }
                return [pair[0], (ToUint32(nextResult) % range) + offset];
            }));
        };
    };
    return NodeCryptoRandomSource;
}());
exports.NodeCryptoRandomSource = NodeCryptoRandomSource;
