"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const co = require("co");
const _1 = require("../../co-limit/dist/index");
exports.limited = _1.limiter(3);
var limit = _1.limiter(3);
function wait(ms) {
    return function (done) {
        setTimeout(done, ms);
    };
}
function* job(arg1) {
    console.log('Doing something for ' + arg1);
    yield wait(1000);
    return [5, arg1];
}
const hiLimitJob = limit(job, 10);
const midLimitJob = limit(job, 5);
const loLimitJob = limit(job, 1);
co(function* () {
    const retVal = [];
    for (var i = 0; i < 10; i++) {
        retVal.push(loLimitJob('lo'));
        retVal.push(midLimitJob('mid'));
        retVal.push(hiLimitJob('hi'));
    }
    retVal.push(hiLimitJob('hi'));
    return yield retVal;
}).then(console.log);
