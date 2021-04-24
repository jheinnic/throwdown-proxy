"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const transducers_js_1 = require("transducers-js");
const asyncsink_1 = require("ix/asyncsink");
const medium_1 = require("medium");
const iterable_1 = require("ix/iterable");
const asynciterable_1 = require("ix/asynciterable");
require("ix/add/asynciterable/create");
require("ix/add/asynciterable/merge");
require("ix/add/asynciterable-operators/map");
require("ix/add/asynciterable-operators/share");
require("ix/add/asynciterable-operators/repeat");
require("ix/add/asynciterable-operators/flatmap");
require("ix/add/asynciterable-operators/mergeall");
require("ix/add/asynciterable-operators/takeuntil");
require("ix/add/asynciterable-operators/takewhile");
require("ix/add/iterable-operators/share");
require("ix/add/iterable/range");
// import {AutoIterate} from '../../infrastructure/lib';
const rxjs_1 = require("rxjs");
const api_1 = require("@jchptf/api");
// const autoIter = new AutoIterate(asyncScheduler);
const masterSequence = iterable_1.IterableX.range(1, 5000)
    .share();
class Source {
    constructor(sourceId) {
        this.sourceId = sourceId;
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            let counter;
            for (counter of masterSequence) {
                // await new Promise(res => {
                //    setTimeout(res, Math.random() * 100)
                // });
                yield yield __await((this.sourceId + counter));
                yield __await((medium_1.sleep(Math.random() * 100)));
            }
        });
    }
}
let CanvasPool = class CanvasPool {
    constructor(availableCanvasQueue, reserveCanvasChan) {
        this.availableCanvasQueue = availableCanvasQueue;
        this.reserveCanvasChan = reserveCanvasChan;
        this.channelOpen = true;
        this.recentlyReturned = [];
        this.canvasPoolSizes = {
            totalCount: 0,
            reserved: 0,
            free: 0
        };
        console.log('Fire for requests');
        medium_1.go(this.scanForRequests.bind(this))
            .then(() => {
            console.log('Process manager stopping');
        })
            .catch((err) => {
            console.error('Process manager error:', err);
        });
        console.log('Fire for returns');
        medium_1.go(this.scanForReturns.bind(this))
            .then(() => {
            console.log('Process manager stopping');
        })
            .catch((err) => {
            console.error('Process manager error:', err);
        });
    }
    scanForRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            while (this.channelOpen) {
                const readyToReserve = this.recentlyReturned;
                this.recentlyReturned = [];
                console.log('Recent returns: ', readyToReserve);
                try {
                    for (var readyToReserve_1 = __asyncValues(readyToReserve), readyToReserve_1_1; readyToReserve_1_1 = yield readyToReserve_1.next(), !readyToReserve_1_1.done;) {
                        let nextCanvas = readyToReserve_1_1.value;
                        nextCanvas.reserve();
                        if (yield medium_1.put(this.reserveCanvasChan, nextCanvas)) {
                            console.log('Reserved', nextCanvas);
                            const newCanvasPoolSizes = {
                                totalCount: this.canvasPoolSizes.totalCount,
                                reserved: this.canvasPoolSizes.reserved + 1,
                                free: this.canvasPoolSizes.free - 1
                            };
                            // this.recentlyReturned.slice(
                            //    this.recentlyReturned.indexOf(nextCanvas), 1);
                            this.notifyWatches(this.canvasPoolSizes, newCanvasPoolSizes);
                            this.canvasPoolSizes = newCanvasPoolSizes;
                        }
                        else {
                            console.error('Shutting down on closed channel.');
                            this.channelOpen = false;
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (readyToReserve_1_1 && !readyToReserve_1_1.done && (_a = readyToReserve_1.return)) yield _a.call(readyToReserve_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                yield (medium_1.sleep(10));
            }
        });
    }
    scanForReturns() {
        return __awaiter(this, void 0, void 0, function* () {
            var e_2, _a;
            console.log('Enter scanForReturns');
            while (this.channelOpen) {
                let inCount = 0;
                try {
                    for (var _b = __asyncValues(this.availableCanvasQueue), _c; _c = yield _b.next(), !_c.done;) {
                        let nextCanvas = _c.value;
                        console.log('Dequeued a canvas');
                        inCount++;
                        this.recentlyReturned.push(nextCanvas);
                        console.log('Scan for returns found ' + inCount);
                        if (inCount > 0) {
                            const oldCanvasPoolSizes = this.canvasPoolSizes;
                            const newCanvasPoolSizes = {
                                totalCount: this.canvasPoolSizes.totalCount,
                                reserved: this.canvasPoolSizes.reserved - inCount,
                                free: this.canvasPoolSizes.free + inCount
                            };
                            this.canvasPoolSizes = newCanvasPoolSizes;
                            this.notifyWatches(oldCanvasPoolSizes, newCanvasPoolSizes);
                            inCount -= inCount;
                        }
                        yield (medium_1.sleep(10));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            console.log('All done!');
        });
    }
    register(newCanvas) {
        new CanvasManager(this.availableCanvasQueue, newCanvas);
        const newCanvasPoolSizes = {
            totalCount: this.canvasPoolSizes.totalCount + 1,
            reserved: this.canvasPoolSizes.reserved + 1,
            free: this.canvasPoolSizes.free
        };
        this.canvasPoolSizes = newCanvasPoolSizes;
        this.notifyWatches(this.canvasPoolSizes, newCanvasPoolSizes);
    }
    addWatch(_id, _fn) {
        return false;
    }
    notifyWatches(_oldState, _newState) {
    }
    removeWatch(_id) {
        return false;
    }
};
CanvasPool = __decorate([
    api_1.iWatch(),
    __metadata("design:paramtypes", [asyncsink_1.AsyncSink, Object])
], CanvasPool);
class ProcessManager {
    constructor(submitChan, reserveCanvasChan, paintRequestSink, storeRequestSink) {
        this.submitChan = submitChan;
        this.reserveCanvasChan = reserveCanvasChan;
        this.paintRequestSink = paintRequestSink;
        this.storeRequestSink = storeRequestSink;
        this.channelOpen = true;
    }
    start() {
        for (let ii = 0; ii < 2; ii++) {
            medium_1.go(this.runThread.bind(this))
                .then(() => {
                console.log('Process manager stopping');
                this.channelOpen = false;
            })
                .catch((err) => {
                console.error('Process manager error:', err);
                this.channelOpen = false;
            });
        }
    }
    runThread() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Running process manager thread');
            while (this.channelOpen) {
                const canvasManager = yield this.reserveCanvasChan;
                if (canvasManager instanceof CanvasManager) {
                    // TODO
                    const canvasId = canvasManager.getReservation();
                    try {
                        const nextTask = yield this.submitChan;
                        console.log('Took:', nextTask, 'on', canvasId);
                        if (!isClosed(nextTask)) {
                            const onPainted = medium_1.chan(undefined, transducers_js_1.map((progress) => progress.length));
                            const paintTask = new CanvasPaintTask(canvasId, nextTask, onPainted);
                            this.paintRequestSink.write(paintTask);
                            console.log('Paint length: ' + (yield onPainted));
                            const onStored = medium_1.chan();
                            const storeTask = new CanvasStoreTask(canvasId, nextTask, onStored);
                            this.storeRequestSink.write(storeTask);
                            console.log('Stored to: ' + (yield onStored));
                        }
                        else {
                            console.log('Shutting down on close of input channel');
                            this.channelOpen = false;
                            break;
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                    finally {
                        console.log('Releasing canvas to other lessees');
                        canvasManager.release();
                    }
                }
                else {
                    console.log('Shutting down on close of input channel');
                    this.channelOpen = false;
                    break;
                }
            }
        });
    }
}
class CanvasPaintTask {
    constructor(canvasId, sourceId, onReturn) {
        this.canvasId = canvasId;
        this.sourceId = sourceId;
        this.onReturn = onReturn;
        console.log('Created task for ' + this.sourceId + ' on ' + this.canvasId);
    }
    *[Symbol.iterator]() {
        const iterCount = 2 + (8 * Math.random());
        console.log(`Began iteration loop of ${iterCount} for ${this.sourceId} on ${this.canvasId}`);
        let sum = 0;
        let progress;
        for (let ii = 0; ii < iterCount; ii++) {
            let boundary = 500000 + (Math.random() * 250000);
            progress = `loop ${ii} of ${boundary} for ${this.sourceId} on ${this.canvasId} after ${sum}`;
            yield progress;
            sum = 0;
            let sense = 2 * (0.5 - Math.random());
            for (let jj = 0; jj < boundary; jj++) {
                sum += sense * jj;
                sense = ((sense > 0) ? -1 : 1) * Math.random();
            }
        }
        console.log(`Ended iteration loop of ${iterCount} for ${this.sourceId} on ${this.canvasId}`);
        progress = `${sum} on ${this.canvasId} for ${this.sourceId}`;
        medium_1.put(this.onReturn, progress)
            .then((value) => { console.log('on Return: ' + value); })
            .catch((err) => { console.error('Failed to respond:', err); });
    }
}
class CanvasStoreTask {
    constructor(canvasId, sourceId, onReturn) {
        this.canvasId = canvasId;
        this.sourceId = sourceId;
        this.onReturn = onReturn;
        console.log('Created storage task for ' + this.sourceId + ' on ' + this.canvasId);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Saving...');
            yield medium_1.sleep(250);
            // console.log('Responding...');
            yield medium_1.put(this.onReturn, this.canvasId);
            console.log('Saved...');
        });
    }
}
class CanvasManager {
    constructor(availableSink, canvasId) {
        this.availableSink = availableSink;
        this.canvasId = canvasId;
        console.log('Created canvas manager ' + this.canvasId);
        this.reserved = false;
        this.availableSink.write(this);
    }
    reserve() {
        if (this.reserved) {
            throw new Error('Not available!');
        }
        this.reserved = true;
        return this.canvasId;
    }
    release() {
        if (!this.reserved) {
            throw new Error('Not reserved!');
        }
        this.reserved = false;
        this.availableSink.write(this);
        console.log('Wrote to available sink');
    }
    getReservation() {
        return this.reserved ? this.canvasId : false;
    }
}
class CanvasPainter {
    constructor(newPaintTaskQueue, scheduler, pulseInterval, paintDuration) {
        this.newPaintTaskQueue = newPaintTaskQueue;
        this.scheduler = scheduler;
        this.pulseInterval = pulseInterval;
        this.paintDuration = paintDuration;
        if (this.paintDuration > this.pulseInterval) {
            throw new Error('pulse interval must be at least as great as paint duration');
        }
        this.paintResumeQueue =
            new asyncsink_1.AsyncSink();
        this.paintWorkQueue =
            asynciterable_1.AsyncIterableX.from(this.paintResumeQueue)
                .mergeAll();
        this.pendingPaintIterators = [];
        this.paintRepeatSource =
            asynciterable_1.AsyncIterableX.from(this.pendingPaintIterators);
        // .repeat();
    }
    start() {
        medium_1.go(this.monitorInboundQueue.bind(this))
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
        medium_1.go(this.doPaintWork.bind(this))
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
        const repeatSource = this.paintRepeatSource;
        const pulseDelay = this.pulseInterval - this.paintDuration;
        const paintDuration = this.paintDuration;
        const pendingPaintIterators = this.pendingPaintIterators;
        this.scheduler.schedule(function (state) {
            const self = this;
            if (!!state) {
                console.log('Scheduler waking...');
                state.write(repeatSource.takeUntil(function () {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            self.schedule(state, pulseDelay);
                            resolve();
                        }, paintDuration);
                    });
                }).takeWhile((value) => {
                    return !((value === undefined) || (pendingPaintIterators.length === 0));
                }));
            }
            else {
                console.error('No Scheduler Queue!?');
            }
        }, this.pulseInterval, this.paintResumeQueue);
    }
    monitorInboundQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            var e_3, _a;
            console.log('Monitoring for paint tasks...');
            try {
                for (var _b = __asyncValues(this.newPaintTaskQueue), _c; _c = yield _b.next(), !_c.done;) {
                    const task = _c.value;
                    this.pendingPaintIterators.push(task[Symbol.iterator]());
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    }
    doPaintWork() {
        return __awaiter(this, void 0, void 0, function* () {
            var e_4, _a;
            console.log('Monitoring for painting step tasks...');
            let nextIterator;
            try {
                for (var _b = __asyncValues(this.paintWorkQueue), _c; _c = yield _b.next(), !_c.done;) {
                    nextIterator = _c.value;
                    const nextResult = nextIterator.next();
                    if (nextResult.done) {
                        this.pendingPaintIterators.splice(this.pendingPaintIterators.indexOf(nextIterator), 1);
                    }
                    else {
                        console.log(nextResult.value);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        });
    }
}
class CanvasWriter {
    constructor(newStoreTaskQueue) {
        this.newStoreTaskQueue = newStoreTaskQueue;
    }
    start() {
        medium_1.go(this.monitorInboundQueue.bind(this))
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
    }
    monitorInboundQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            var e_5, _a;
            console.log('Monitoring for write tasks...');
            try {
                for (var _b = __asyncValues(this.newStoreTaskQueue), _c; _c = yield _b.next(), !_c.done;) {
                    const task = _c.value;
                    yield task.save();
                    console.log(`Saved content from ${task.canvasId} of ${task.sourceId}`);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        });
    }
}
const sourceSink = new asyncsink_1.AsyncSink();
sourceSink.write(asynciterable_1.AsyncIterableX.from(new Source(10000)));
sourceSink.write(asynciterable_1.AsyncIterableX.from(new Source(30000)));
sourceSink.write(asynciterable_1.AsyncIterableX.from(new Source(50000)));
const sources = 
// AsyncIterableX.from(sourceSink)
asynciterable_1.AsyncIterableX.from(sourceSink[Symbol.asyncIterator]())
    .mergeAll()
    .share();
const submitTask = medium_1.chan();
const reserveCanvasChan = medium_1.chan();
const availableCanvasQueue = new asyncsink_1.AsyncSink();
const newPaintTaskQueue = new asyncsink_1.AsyncSink();
const newStoreTaskQueue = new asyncsink_1.AsyncSink();
const canvasPool = new CanvasPool(availableCanvasQueue, reserveCanvasChan);
const processMgr = new ProcessManager(submitTask, reserveCanvasChan, newPaintTaskQueue, newStoreTaskQueue);
const canvasPainter = new CanvasPainter(newPaintTaskQueue, rxjs_1.asyncScheduler, 250, 100);
const canvasWriter = new CanvasWriter(newStoreTaskQueue);
processMgr.start();
canvasPainter.start();
canvasWriter.start();
canvasPool.register(88);
canvasPool.register(75);
canvasPool.register(39);
canvasPool.register(101);
for (let ii = 0; ii < 4; ii++) {
    medium_1.go(function () {
        return __awaiter(this, void 0, void 0, function* () {
            var e_6, _a;
            const id = ii;
            console.log('Begin reader', id);
            try {
                for (var sources_1 = __asyncValues(sources), sources_1_1; sources_1_1 = yield sources_1.next(), !sources_1_1.done;) {
                    const taskDef = sources_1_1.value;
                    // console.log('Feeding...');
                    yield medium_1.put(submitTask, taskDef);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (sources_1_1 && !sources_1_1.done && (_a = sources_1.return)) yield _a.call(sources_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            console.log('Finish reader', id);
        });
    })
        .then(console.log.bind(console))
        .catch(console.error.bind(console));
}
canvasPool.addWatch('strtest', (_id, _old, newSizes) => {
    console.log('watch notifier receives', newSizes, _id);
});
/*
const _w1: CanvasManager = new CanvasManager(1, sources);
const _w2: CanvasManager = new CanvasManager(2, sources);
const _w3: CanvasManager = new CanvasManager(3, sources);
const _w4: CanvasManager = new CanvasManager(4, sources);

const _wIncoming = AsyncIterableX.merge(
   AsyncIterableX.from(_w1),
   AsyncIterableX.from(_w2),
   AsyncIterableX.from(_w3),
   AsyncIterableX.from(_w4)
);

for (let ii = 0; ii < 3; ii++) {
   go(async function () {
      let nextTask: CanvasTask;
      for await (nextTask of _wIncoming) {
         let taskSink: AsyncSink<string> = new AsyncSink<string>();
         autoIter.run(nextTask, taskSink, 10);
         for await (let step of taskSink) {
            console.log('step: ' + step);
         }
         console.log('No more steps');
      }
      console.error('No more work?');
   })
      .then(
         function () {
            console.log('Exit from feeder loop #' + ii);
         }
      )
      .catch(
         function (err: any) {
            console.error(`Exit from feeder loop ${ii} with error:`, err);
         }
      );
}
*/
function isClosed(chanVal) {
    return chanVal === medium_1.CLOSED;
}
exports.isClosed = isClosed;
//# sourceMappingURL=tryIx07.js.map