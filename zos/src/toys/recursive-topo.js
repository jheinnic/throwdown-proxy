"use strict";
exports.__esModule = true;
// @ts-ignore
var topo_1 = require("topo");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function replicate(times) {
    return function (obs) {
        return obs.pipe(operators_1.flatMap(function (item) { return rxjs_1.range(1, times).pipe(operators_1.mapTo(item)); }));
    };
}
function repeatForever(value) {
    return rxjs_1.generate({
        initialState: value,
        iterate: function (value) { return value; },
        scheduler: rxjs_1.asapScheduler
    });
}
var RecursiveTopoFactory = /** @class */ (function () {
    function RecursiveTopoFactory(treeDepth, subtreeDepth, maxNodeIndex) {
        this.treeDepth = treeDepth;
        this.subtreeDepth = subtreeDepth;
        this.factor = 1;
        this.topo = new topo_1["default"]();
        this.factor = Math.pow(2, subtreeDepth);
        this.maxNodeIndex = Math.min(maxNodeIndex, Math.pow(2, treeDepth) - 1);
    }
    RecursiveTopoFactory.prototype.run = function () {
        var _this = this;
        var computeRoots = rxjs_1.generate({
            initialState: {
                nodeIndex: 0,
                depthIndex: 0,
                nextLevelAt: 0
            },
            condition: function (x) {
                // console.log('Test:', x);
                return (x.nodeIndex < _this.maxNodeIndex) && (x.depthIndex <= _this.treeDepth);
            },
            iterate: function (x) {
                if (x.nodeIndex < x.nextLevelAt) {
                    return Object.assign({}, x, { nodeIndex: x.nodeIndex + 1 });
                }
                console.log('X was on the right at', x);
                var depthIndex = x.depthIndex + _this.subtreeDepth;
                if (depthIndex > _this.treeDepth) {
                    depthIndex = _this.treeDepth;
                }
                var nodeIndex = Math.pow(2, depthIndex) - 1;
                var nextLevelAt = nodeIndex + nodeIndex;
                return {
                    nodeIndex: nodeIndex,
                    depthIndex: depthIndex,
                    nextLevelAt: nextLevelAt
                };
            }
        });
        var localRoots = computeRoots.pipe(operators_1.share());
        var dependsUpon = rxjs_1.concat(localRoots.pipe(operators_1.skip(1)), repeatForever(null));
        var dependents = localRoots.pipe(replicate(this.factor));
        rxjs_1.zip(dependents, dependsUpon).pipe(operators_1.distinct(function (pair) {
            var dependsOn = pair[1];
            if (!!dependsOn) {
                return pair[0].nodeIndex + ":" + dependsOn.nodeIndex;
            }
            else {
                return pair[0].nodeIndex;
            }
        }), operators_1.finalize(function () {
            console.log(JSON.stringify(_this.topo.nodes));
        })).subscribe(function (pair) {
            var dependsOn = pair[1];
            if (!!dependsOn) {
                // console.log(
                //    `(Node ${pair[0].nodeIndex} from level ${pair[0].depthIndex}) follows (Node
                // ${dependsOn.nodeIndex} from level ${dependsOn.depthIndex})`
                // );
                _this.topo.add(dependsOn.nodeIndex, { group: dependsOn.nodeIndex, before: [pair[0].nodeIndex] });
                // } else {
                // console.log(
                //   `(Node ${pair[0].nodeIndex} from level ${pair[0].depthIndex}) depends on nothing.`
                // );
            }
        });
        // counter.subscribe(
        //   (subtreeCount: number) => {
        //      console.log(`Counted ${subtreeCount} subtrees`);
        //   }
        // );
        console.log('Created pipeline');
        // console.log(this.topo.nodes);
        // console.log(JSON.stringify(this.topo.nodes));
        return;
    };
    return RecursiveTopoFactory;
}());
exports.RecursiveTopoFactory = RecursiveTopoFactory;
var test = new RecursiveTopoFactory(13, 4, 500000);
test.run();
