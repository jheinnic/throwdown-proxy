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
var merkle_layer_locator_value_1 = require("./merkle-layer-locator.value");
var typescript_optional_1 = require("typescript-optional");
var BlockMappedLayerLocator = /** @class */ (function (_super) {
    __extends(BlockMappedLayerLocator, _super);
    /**
     * In addition to the layer descriptive properties
     *
     * @see MerkleLayerLocator
     * @param rootDepth Digest layer depth as defined by MerkleLayerLocator
     * @param size Maximum number of digests at this levels' root Merkle Layer as per MerkleLayerLocator
     * @param level Zero-based index of the physical block tier across all block levels of a given
     * Merkle tree's physical storage mapping.
     * @param leafLayer MerkleLayerLocator where subtrees from this layer's mapped physical storage
     * level get their leaf-most MerkleDigestLocators.
     * @param blockHeight The number of MerkleLayerLocator depths encapsulated by this
     * BlockMappedLevelLocator.  Generally this is the same value for all BlockMappedLevelLocator's except
     * at level=0.
     * @param blockWidth The number of MerkleDigestLocators in each of this Level's
     * BlockMappedSubtreeLocators at their leaf (lowest) MerkleLayerLocator.
     * @param blockReach The number of BlockMappedDigestLocator children to the left and right of each
     * of its leaf digests.  Generally, twice the width except at the blocks of the lowest tree level.
     * @param leftOffset Zero-based index of left-most BlockMappedDigestLocator's blockIndex from
     * this layer across entire tree, numbered left to right within levels, starting at root level,
     * then proceeding downward to lower levels.
     * @param rightOffset Zero-based index of right-most BlockMappedDigestLocator's blockIndex from
     * this layer across entire tree, numbered left to right within levels, starting at root level,
     * then proceeding downward to lower levels.
     */
    function BlockMappedLayerLocator(level, size, rootDepth, leafLayer, blockHeight, blockWidth, blockReach, leftOffset, rightOffset) {
        var _this = _super.call(this, rootDepth, size) || this;
        _this.level = level;
        _this.size = size;
        _this.rootDepth = rootDepth;
        _this.leafLayer = leafLayer;
        _this.blockHeight = blockHeight;
        _this.blockWidth = blockWidth;
        _this.blockReach = blockReach;
        _this.leftOffset = leftOffset;
        _this.rightOffset = rightOffset;
        return _this;
    }
    Object.defineProperty(BlockMappedLayerLocator.prototype, "blockMapped", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    BlockMappedLayerLocator.prototype.asBlockMapped = function () {
        return typescript_optional_1["default"].of(this);
    };
    return BlockMappedLayerLocator;
}(merkle_layer_locator_value_1.MerkleLayerLocator));
exports.BlockMappedLayerLocator = BlockMappedLayerLocator;
