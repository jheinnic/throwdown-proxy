"use strict";
exports.__esModule = true;
/**
 * Specialized subclass of LogicalSubtreeLocator that is suitable only for subtrees aligned with a
 * storage block boundary.  For any stored Merkle Tree, there is a subset of its logical layers where
 * the series of node values for each node in the logical maps to the first few bytes from each of a
 * series of consecutive storage blocks.  The remaining content of such blocks stores the rest of the
 * subtree between those nodes and the roots of the next block-aligned subtrees.
 *
 * Instances of this interface are used to identify the range of content found in storage system blocks,
 * and also to provide a mapping between their physical and logical offsets.
 */
var BlockMappedSubtreeLocator = /** @class */ (function () {
    function BlockMappedSubtreeLocator(root, leafLayer, leftLeafSpan, rightLeafSpan) {
        this.root = root;
        this.leafLayer = leafLayer;
        this.leftLeafSpan = leftLeafSpan;
        this.rightLeafSpan = rightLeafSpan;
        if (rightLeafSpan < leftLeafSpan) {
            throw new Error('Right span cannot be to the left of left span');
        }
        if (leftLeafSpan < 0) {
            throw new Error('Left span cannot be negative');
        }
        if (leafLayer.depth < root.depth) {
            throw new Error('Leaf layer cannot be above the root node');
        }
        this.width = rightLeafSpan + 1 - leftLeafSpan;
        if (this.width > leafLayer.size) {
            throw new Error('Left span and right span width cannot exceed ' + leafLayer.size);
        }
        this.leftLeafPosition = this.leafLayer.leftPosition + this.leftLeafSpan;
        this.rightLeafPosition = this.leafLayer.leftPosition + this.rightLeafSpan;
    }
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "offset", {
        /**
         * Zero-based address of a block given an absolute ordering beginning with the root, then
         * proceeding through each block of each successive layer without resetting the addresses to
         * zero at each descent from one layer to next below.
         */
        get: function () {
            return this.root.blockOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "level", {
        /**
         * Zero-based index of a block's height relative to the storage tree's root.  Level is measured
         * in units per subtree, regardless of how many Merkle layers each subtree spans.
         */
        get: function () {
            return this.root.blockLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "rootDepth", {
        /**
         * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
         * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
         * a layer depth equal to the height (or depth) of the tree in which they are located, at
         * layer indices ranging from 0 to ((2^depth) - 1).
         */
        get: function () {
            return this.root.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "leafDepth", {
        get: function () {
            return this.leafLayer.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "orientation", {
        get: function () {
            return this.root.orientation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "rootIndex", {
        /**
         * Zero-based index of a block relative to the first block at the same height.
         */
        get: function () {
            return this.root.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockMappedSubtreeLocator.prototype, "rootPosition", {
        /**
         * Zero-based index of a digest relative to all digests in the tree numbered from root
         * to leaf layers, and left to right within each layer.
         *
         * Easily confused with "offset", since it assigns an absolute order to every block
         * mapped digest as well as the blocks they map to, but its is different insofar as
         * position values also enumerate the non-mapped inner digests, whereas offset only
         * counts the blocks, for which there is only one root per block.
         */
        get: function () {
            return this.root.position;
        },
        enumerable: true,
        configurable: true
    });
    return BlockMappedSubtreeLocator;
}());
exports.BlockMappedSubtreeLocator = BlockMappedSubtreeLocator;
