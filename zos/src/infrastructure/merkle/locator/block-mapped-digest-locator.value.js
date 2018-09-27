"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var merkle_digest_locator_value_1 = require("./merkle-digest-locator.value");
var typescript_optional_1 = require("typescript-optional");
var BlockMappedDigestLocator = /** @class */ (function (_super) {
    __extends(BlockMappedDigestLocator, _super);
    /**
     * A zero-based index for locating a node within its layer.  The indices for each layer range
     * from 0 to ((2^depth) - 1) where depth is the 0-based index for tree depth layers, with the
     * root at depth=0.  For a tree of depth N, all its 2^N leaves are at depth layer N.
     */
    function BlockMappedDigestLocator(rootLayer, index, treeDepth) {
        var _this = _super.call(this, rootLayer, index, treeDepth) || this;
        _this.rootLayer = rootLayer;
        _this.index = index;
        return _this;
    }
    Object.defineProperty(BlockMappedDigestLocator.prototype, "blockOffset", {
        get: function () {
            return this.rootLayer.leftOffset + this.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "blockLevel", {
        get: function () {
            return this.rootLayer.level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "blockHeight", {
        get: function () {
            return this.rootLayer.blockHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "blockWidth", {
        get: function () {
            return this.rootLayer.blockWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "blockReach", {
        get: function () {
            return this.rootLayer.blockReach;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "rootDepth", {
        get: function () {
            return this.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "leafDepth", {
        get: function () {
            return this.leafLayer.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "leafLayer", {
        get: function () {
            return this.rootLayer.leafLayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "leftLeafSpan", {
        get: function () {
            return this.index * this.blockWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "rightLeafSpan", {
        get: function () {
            return this.leftLeafSpan + this.blockWidth - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "leftLeafPosition", {
        get: function () {
            return this.leafLayer.leftPosition + this.leftLeafSpan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "rightLeafPosition", {
        get: function () {
            return this.leafLayer.leftPosition + this.rightLeafSpan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedDigestLocator.prototype, "blockMapped", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    BlockMappedDigestLocator.prototype.asBlockMapped = function () {
        return typescript_optional_1["default"].of(this);
    };
    return BlockMappedDigestLocator;
}(merkle_digest_locator_value_1.MerkleDigestLocator));
exports.BlockMappedDigestLocator = BlockMappedDigestLocator;
