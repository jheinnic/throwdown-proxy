"use strict";
exports.__esModule = true;
var merkle_orientation_type_enum_1 = require("./merkle-orientation-type.enum");
var merkle_node_type_enum_1 = require("./merkle-node-type.enum");
var typescript_optional_1 = require("typescript-optional");
var MerkleDigestLocator = /** @class */ (function () {
    /**
     * A zero-based index for locating a node within its layer.  The indices for each layer range
     * from 0 to ((2^depth) - 1) where depth is the 0-based index for tree depth layers, with the
     * root at depth=0.  For a tree of depth N, all its 2^N leaves are at depth layer N.
     */
    function MerkleDigestLocator(layer, index, treeDepth) {
        this.layer = layer;
        this.index = index;
        this.treeDepth = treeDepth;
        if (index < 0) {
            throw new Error('Node index may not be negative');
        }
        if (index >= layer.size) {
            throw new Error('Node index cannot exceed layer size, ' + layer.size);
        }
    }
    Object.defineProperty(MerkleDigestLocator.prototype, "depth", {
        /**
          * A zero-based index for locating a node's layer.  The root node is at depth 0, and its
          * and its immediate children are all at depth 1.  All leaf nodes are found at a layer depth
          * equal to the tree's overall height minus one.
          */
        get: function () {
            return this.layer.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "position", {
        /**
         * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
         * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
         * a layer depth equal to the height (or depth) of the tree in which they are located, at
         * layer indices ranging from 0 to ((2^depth) - 1).
         */
        get: function () {
            return this.layer.leftPosition + this.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "orientation", {
        get: function () {
            return ((this.index % 2) == 0)
                ? (this.depth > 0)
                    ? merkle_orientation_type_enum_1.MerkleOrientationType.LEFT_CHILD
                    : merkle_orientation_type_enum_1.MerkleOrientationType.ROOT
                : merkle_orientation_type_enum_1.MerkleOrientationType.RIGHT_CHILD;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "nodeType", {
        /**
         * A zero-based index for locating a node based on an absolute ordering of nodes both within
         * and between layers.  For this case, the root has an address of zero, and its two immediate
         * children have addresses of 1 and 2, and their children occupy addresses 3 through 6.
         *
         * For any layer N, the node address of its earliest resident node is always ((2^N) - 1), and
         * the node address of its last resident node is always ((2^(N+1)) - 2).  This correlates well
         * with the rule that dictates any tree of depth N will always have ((2^(N+1)) - 1) nodes, with
         * (2^N) leaves and ((2^N) - 1) internal nodes.
         *
         * Note that the math above works out because node counts are one-based, whereas addresses are
         * zero-based, hence ((2^(N+1) - 2) is the address for the ((2^(N+1) - 1)th node.
         */
        get: function () {
            if (this.depth == 0) {
                return merkle_node_type_enum_1.MerkleNodeType.ROOT;
            }
            if (this.depth < this.treeDepth) {
                return merkle_node_type_enum_1.MerkleNodeType.INTERNAL;
            }
            return merkle_node_type_enum_1.MerkleNodeType.LEAF;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "siblingIndex", {
        get: function () {
            return ((this.index % 2) == 0)
                ? (this.depth > 0)
                    ? this.index + 1
                    : undefined
                : this.index - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "siblingPosition", {
        get: function () {
            return ((this.index % 2) == 0)
                ? (this.depth > 0)
                    ? this.position + 1
                    : undefined
                : this.position - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "leftMostPosition", {
        get: function () {
            return (Math.pow(2, this.treeDepth - 1) - 1)
                + (this.index * Math.pow(2, this.treeDepth - this.depth - 1));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "rightMostPosition", {
        get: function () {
            return (Math.pow(2, this.treeDepth - 1) - 1)
                + ((this.index + 1) * Math.pow(2, this.treeDepth - this.depth - 1))
                - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MerkleDigestLocator.prototype, "blockMapped", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    MerkleDigestLocator.prototype.asBlockMapped = function () {
        return typescript_optional_1["default"].empty();
    };
    return MerkleDigestLocator;
}());
exports.MerkleDigestLocator = MerkleDigestLocator;
