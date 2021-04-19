"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var control = new rxjs_1.Subject();
var source = rxjs_1.range(0, 100);
var feed = control; 
var workSub = rxjs_1.zip(source, feed).pipe(
operators_1.observeOn(rxjs_1.asapScheduler),
operators_1.map(function (input) {
    console.log("Read " + input[0] + " using guard " + input[1]);
    return input[1];
})).subscribe(control);
control.next('One');
control.next('Two');
new Promise(function (resolve, reject) {
}).then(function () {
    console.log('Done');
})["catch"](function (err) {
    console.error(err);
});
