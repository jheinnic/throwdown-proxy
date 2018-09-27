"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es_membrane_1 = require("es-membrane");
require("reflect-metadata");
// Establish "wet" view of an object.
// Get a "dry" view of the same object.
// dryDocument is a Proxy whose target is wetDocument, and whose handler is dryHandler.
// Return "top-level" document proxy.
var Child = /** @class */ (function () {
    function Child(_parent, _id) {
        this._parent = _parent;
        this._id = _id;
    }
    Child.prototype.getId = function () {
        return this._id;
    };
    Child.prototype.getParent = function () {
        return this._parent;
    };
    Object.defineProperty(Child.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Child.prototype.setName = function (name) {
        this._name = name;
    };
    Child.prototype.getName = function () {
        return this._name;
    };
    return Child;
}());
exports.Child = Child;
var Parent = /** @class */ (function () {
    function Parent(_name, count) {
        this._name = _name;
        this._counter = count;
        this._children = new Array(count);
        for (var ii = 0; ii < count; ii++) {
            this._children[ii] = new Child(this, ii);
        }
    }
    Parent.prototype.count = function () {
        return this._counter++;
    };
    Parent.prototype.getChild = function (ii) {
        return this._children[ii];
    };
    Object.defineProperty(Parent.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return Parent;
}());
exports.Parent = Parent;
var AssetLeaseFactory = /** @class */ (function () {
    function AssetLeaseFactory() {
    }
    AssetLeaseFactory.prototype.leaseAsset = function (lessee, asset) {
        /*
         * The object graph names I want are "lessor" and "lessee".
         * "lessor" views object graphs for what I own.
         * "lessee" views object graphs with restrictions to enable sharing with code I do not own.
         */
        // Establish the Membrane.
        var membrane = new es_membrane_1.Membrane({});
        // Establish "wet" lessor ObjectGraphHandler.
        var lessorHandler = membrane.getHandlerByName('lessor', { mustCreate: true });
        // Establish "dry" lessee ObjectGraphHandler.
        var lesseeHandler = membrane.getHandlerByName('lessee', { mustCreate: true });
        return new AssetLease(membrane, lessorHandler, lesseeHandler, lessee, asset);
    };
    return AssetLeaseFactory;
}());
exports.AssetLeaseFactory = AssetLeaseFactory;
var AssetLease = /** @class */ (function () {
    function AssetLease(lessee, _membrane, _lessorHandler, _lesseeHandler, _lessorAsset) {
        this.lessee = lessee;
        this._membrane = _membrane;
        this._lessorHandler = _lessorHandler;
        this._lesseeHandler = _lesseeHandler;
        this._lessorAsset = _lessorAsset;
        var modifyApi = this._membrane.modifty;
        var foo1 = this._membrane.createChainHandler(this._lesseeHandler);
        console.log(foo1);
        var foo2 = this._lesseeHandler.addProxyListener(function (meta) {
            console.log(meta);
        });
        console.log(foo2);
        this.lesseeAsset =
            this._membrane.convertArgumentToProxy(this._lessorHandler, this._lesseeHandler, this._lessorAsset);
    }
    AssetLease.prototype.unsubscribe = function () {
        console.log('TODO: Unsubscribe!');
    };
    return AssetLease;
}());
exports.AssetLease = AssetLease;
var TaskWorker = /** @class */ (function () {
    function TaskWorker(_leftChild, _rightChild) {
        this._leftChild = _leftChild;
        this._rightChild = _rightChild;
    }
    TaskWorker.prototype.doTask = function (parent) {
        var childOne = parent.getChild(this._leftChild);
        var nameOne = childOne.getName();
        var childTwo = parent.getChild(this._rightChild);
        childOne.setName(childTwo.getName());
        childTwo.setName(nameOne);
    };
    return TaskWorker;
}());
exports.TaskWorker = TaskWorker;
var factory = new AssetLeaseFactory();
var parentOne = new Parent('Clarice', 2);
var parentTwo = new Parent('Kyle', 4);
var parentThree = new Parent('Mason', 5);
var taskOne = new TaskWorker(1, 0);
var taskTwo = new TaskWorker(0, 3);
var taskThree = new TaskWorker(4, 2);
var leaseOne = factory.leaseAsset(taskOne, parentOne);
var leaseTwo = factory.leaseAsset(taskTwo, parentTwo);
var leaseThree = factory.leaseAsset(taskThree, parentThree);
console.log(parentOne === leaseOne.lesseeAsset);
console.log(parentTwo === leaseTwo.lesseeAsset);
console.log(parentThree === leaseThree.lesseeAsset);
console.log('Parent/Task Action One');
console.log(parentOne.count(), parentOne.count(), parentOne.getChild(1), parentOne.getChild(0));
console.log(leaseOne.lesseeAsset.getChild(1), leaseOne.lesseeAsset.getChild(0));
console.log(leaseOne.lessee.doTask(leaseOne.lesseeAsset), parentOne.getChild(1), parentOne.getChild(0));
console.log('Parent/Task Action Two');
console.log(parentTwo.count(), parentTwo.count(), parentTwo.getChild(1), parentTwo.getChild(0));
console.log(leaseTwo.lesseeAsset.getChild(1), leaseTwo.lesseeAsset.getChild(0));
console.log(leaseTwo.lessee.doTask(leaseTwo.lesseeAsset), parentTwo.getChild(1), parentTwo.getChild(0));
console.log('Parent/Task Action Three');
console.log(parentThree.count(), parentThree.count(), parentThree.getChild(1), parentThree.getChild(0));
console.log(leaseThree.lesseeAsset.getChild(1), leaseThree.lesseeAsset.getChild(0));
console.log(leaseThree.lessee.doTask(leaseThree.lesseeAsset), parentThree.getChild(1), parentThree.getChild(0));
