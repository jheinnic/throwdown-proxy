"use strict";
exports.__esModule = true;
var Scarlet = require("scarlet");
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
var timesCalled = 0;
var scarlet = new Scarlet();
var LeasedAssetFactory = /** @class */ (function () {
    function LeasedAssetFactory() {
        this._classMap = new Map();
    }
    LeasedAssetFactory.prototype.leaseAsset = function (asset, lessee) {
        var assetClassProxy = this._classMap.get(asset.constructor);
        var _instanceSet = new Set();
        if (!assetClassProxy) {
            var assetInterceptor = function (proceed) {
                // 'Before Advice'
                var result = proceed(); // 'Target Method' or 'Join Point'
                // 'After Advice'
                timesCalled += 1;
            };
            assetClassProxy =
                scarlet.intercept(MyClass).using(myInterceptor).proxy();
            this._classMap.set(asset.constructor, assetClassProxy);
        }
        asset.constructor = assetClassProxy;
        asset.__proto__ = assetClassProxy.prototype;
        _instanceSet.add(asset);
        return new LeasedAsset(this, lessee, asset);
        ;
    };
    LeasedAssetFactory.prototype.adaptChild = function (child, parent) {
        return child;
    };
    return LeasedAssetFactory;
}());
exports.LeasedAssetFactory = LeasedAssetFactory;
var LeasedAsset = /** @class */ (function () {
    function LeasedAsset(_factory, lessee, asset) {
        this._factory = _factory;
        this.lessee = lessee;
        this.asset = asset;
    }
    return LeasedAsset;
}());
exports.LeasedAsset = LeasedAsset;
