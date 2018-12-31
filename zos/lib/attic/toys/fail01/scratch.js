"use strict";
exports.__esModule = true;
var CriticalScheduler = /** @class */ (function () {
    function CriticalScheduler(baseScheduler) {
        this.baseScheduler = baseScheduler;
        this.counter = 0;
    }
    CriticalScheduler.prototype.now = function () {
        return this.baseScheduler.now();
    };
    CriticalScheduler.prototype.schedule = function (work, delay, state) {
        console.log('I am really', this.baseScheduler);
        var timeClass = this.counter++;
        console.log('Before ' + timeClass);
        var newWork = {
            schedule: function (state, delay) {
                console.log('Action Before ' + timeClass);
                var retVal2 = work.schedule(state, delay);
                console.log('Action After ' + timeClass);
                return retVal2;
            }
        };
        var retVal = this.baseScheduler.schedule(work, delay, state);
        console.log('After ' + timeClass);
        return retVal;
    };
    return CriticalScheduler;
}());
exports.CriticalScheduler = CriticalScheduler;
