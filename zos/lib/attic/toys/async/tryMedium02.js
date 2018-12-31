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
var workers = [];
var gone = [];
var numWorkers = 4;
var numTasks = 50;
var _loop_1 = function (ii) {
    var thisChan = medium_1.chan();
    gone.push(medium_1.go(function () {
        return __awaiter(this, void 0, void 0, function () {
            var identity, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identity = ii;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        return [4 /*yield*/, medium_1.sleep(75 + identity * 60)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, thisChan];
                    case 3:
                        message = _a.sent();
                        if (!(message instanceof Array)) return [3 /*break*/, 5];
                        console.log("Worker " + identity + " reads " + message[0]);
                        return [4 /*yield*/, medium_1.sleep(75 + identity * 60)];
                    case 4:
                        _a.sent();
                        message[1](ii);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }));
    workers.push(thisChan);
};
for (var ii = 0; ii < numWorkers; ii++) {
    _loop_1(ii);
}
var pending = [];
var sourcePromise = medium_1.go(function () {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_2, ii;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_2 = function (ii) {
                        var message = 'Task #' + (ii + 1);
                        console.log('Sending ' + message);
                        pending.push(new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var candidates, jj;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        candidates = [];
                                        for (jj = 0; jj < numTasks; jj++) {
                                            candidates.push([workers[jj], [message + ' for ' + jj, resolve, reject]]);
                                        }
                                        return [4 /*yield*/, medium_1.any(candidates[0], candidates[1], candidates[2], candidates[3])];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }));
                    };
                    for (ii = 0; ii < numTasks; ii++) {
                        _loop_2(ii);
                    }
                    return [4 /*yield*/, Promise.all(pending.slice(0, 10))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
});
Promise.all(pending).then(function (values) { console.log('All tasks done', values); })["catch"](function (err) { console.error(err); });
sourcePromise.then(function (value) {
    console.log('Outer loop', value);
})["catch"](function (err) {
    console.error(err);
});
Promise.all(gone).then(function (value) { console.log('Worker loop', value); })["catch"](function (err) { console.error(err); });
