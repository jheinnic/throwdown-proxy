"use strict";
exports.__esModule = true;
var typescript_optional_1 = require("typescript-optional");
var MerkleLayerLocator = /** @class */ (function () {
    function MerkleLayerLocator(depth, size) {
        this.depth = depth;
        this.size = size;
        this.leftPosition = size - 1;
        this.rightPosition = this.leftPosition * 2;
    }
    Object.defineProperty(MerkleLayerLocator.prototype, "blockMapped", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    MerkleLayerLocator.prototype.asBlockMapped = function () {
        return typescript_optional_1["default"].empty();
    };
    return MerkleLayerLocator;
}());
exports.MerkleLayerLocator = MerkleLayerLocator;
