"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.__esModule = true;
var medium_1 = require("medium");
var numWorkers = 4;
var numSources = 1;
var numTasks = 30;
var MAX_SLOTS = 64;
var workers = [];
var workerSemaphore = medium_1.chan(MAX_SLOTS);
console.log('Spawning workers');
var _loop_1 = function (ii) {
    var identity = ii;
    var thisChan = medium_1.chan();
    workers.push(thisChan);
    // put(workerSemaphore, identity).then(function() {
    medium_1.repeatTake(thisChan, function (message, _acc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // console.log('Worker ' + identity + ' reads ' + message[0]);
                    return [4 /*yield*/, medium_1.sleep(250 + (Math.random() * 1000))];
                    case 1:
                        // console.log('Worker ' + identity + ' reads ' + message[0]);
                        _a.sent();
                        console.log('Worker ' + identity + ' replied to ' + message[0]);
                        return [4 /*yield*/, medium_1.put(message[1], ii)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, identity];
                }
            });
        });
    }, identity);
    // }).catch(console.error);
};
// {
//    const identity = 0;
//    const thisChan: Chan<[string, Chan<number>]> = chan();
//    workers.push(thisChan);
//
//    repeatTake(thisChan, async function (message: [string, Chan<number>], _acc) {
//       console.log('Worker ' + identity + ' reads ' + message[0]);
//       await sleep(250 + (
//          Math.random() * 5000
//       ));
//       console.log('Worker ' + identity + ' replied to ' + message[0]);
//       await put(message[1], 0);
//
//       return identity;
//    }, identity);
// }
for (var ii = 0; ii < numWorkers; ii++) {
    _loop_1(ii);
}
// type Slot = Nominal<number, 'SemaphoreSlot'>;
var sourceSemaphore = medium_1.chan(MAX_SLOTS);
console.log('Feeding source channels');
medium_1.go(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 1:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 2:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 3:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 4:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 5:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 6:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 7:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 8:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 9:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 10:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 11:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 12:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 13:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 14:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 15:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 16:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 17:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 18:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 19:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(sourceSemaphore, [medium_1.chan()])];
                case 20:
                    _a.sent();
                    console.log(1);
                    return [4 /*yield*/, medium_1.put(workerSemaphore, 42)];
                case 21:
                    _a.sent();
                    console.log(2);
                    // put(sourceSemaphore, 9);
                    // put(sourceSemaphore, 10);
                    console.log('Source semaphore loaded');
                    return [2 /*return*/];
            }
        });
    });
}).then(function () {
    console.log('Spawning sources');
    for (var kk = 0; kk < numSources; kk++) {
        medium_1.repeatTake(sourceSemaphore, function (retChan, state) {
            return __awaiter(this, void 0, void 0, function () {
                var taskId, sourceId, message, candidates, jj;
                return __generator(this, function (_a) {
                    taskId = state.taskId, sourceId = state.sourceId;
                    message = 'Task #' + taskId + ' from Source #' + sourceId;
                    candidates = [];
                    for (jj = 0; jj < numWorkers; jj++) {
                        candidates.push([workers[jj], [message + ' for ' + jj, retChan[0]]]);
                    }
                    medium_1.go(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var handle, sent, retVal;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // console.log('On nested entry, ' + pending + ' pending');
                                        console.log('Preparing ' + message);
                                        return [4 /*yield*/, medium_1.sleep(7500 + (2500 * Math.random()))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, workerSemaphore];
                                    case 2:
                                        handle = _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, , 5, 7]);
                                        return [4 /*yield*/, medium_1.any.apply(void 0, candidates)];
                                    case 4:
                                        sent = _a.sent();
                                        if (sent[0]) {
                                            console.log('Sent ' + message + ' to ' + workers.indexOf(sent[1]) + ' using ' + handle);
                                        }
                                        else {
                                            console.log('Failed to send ' + message + ': ' + sent[0]);
                                        }
                                        return [3 /*break*/, 7];
                                    case 5: 
                                    // console.log('Handle in: ' + handle);
                                    return [4 /*yield*/, medium_1.put(workerSemaphore, handle)];
                                    case 6:
                                        // console.log('Handle in: ' + handle);
                                        _a.sent();
                                        return [7 /*endfinally*/];
                                    case 7: return [4 /*yield*/, retChan[0]];
                                    case 8:
                                        retVal = _a.sent();
                                        if (typeof retVal === 'object') {
                                            return [2 /*return*/, -1];
                                        }
                                        return [4 /*yield*/, medium_1.put(sourceSemaphore, retChan)];
                                    case 9:
                                        _a.sent();
                                        return [2 /*return*/, retVal];
                                }
                            });
                        });
                    })
                        .then(function (result) {
                        console.log('Received reply of ' + result + ' to ' + message);
                    })["catch"](console.error);
                    // console.log('On exit, ' + pending + ' pending');
                    return [2 /*return*/, (taskId < numTasks)
                            ? { taskId: taskId + 1, sourceId: sourceId }
                            : false];
                });
            });
        }, { taskId: 1, sourceId: kk + 1 });
    }
});
// const slotsHeld: Slot[] = [];
// const repliesPending: (Chan<Pending>|Chan<number>)[] = [pending];
//
// repeat(
//    async function(nextCall: Pending, callsLeft: number) {
//
//       slotsHeld.push(nextCall[1]);
//       repliesPending.push(nextCall[0]);
//
//       return (callsLeft > 0) ? callsLeft - 1 : false;
//    }, numTasks - 1
// );
// Promise.all(pending)
//    .then(
//       (values: number[]) => { console.log('All tasks done', values); }
//    )
//    .catch(
//       (err: any) => { console.error(err); }
//    );
// sourcePromise.then((value: void) => {
//    console.log('Outer loop', value);
// })
//    .catch((err: any) => {
//       console.error(err);
//    });
// Promise.all(gone)
//    .then(
//       (value: any[]) => { console.log('Worker loop', value); }
//    )
//    .catch(
//       (err: any) => { console.error(err); }
//    );
/*
console.log('Sleeping');
go(async function () {
   await sleep(10000);
});
*/
