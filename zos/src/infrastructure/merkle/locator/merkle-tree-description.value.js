"use strict";
exports.__esModule = true;
var MerkleTreeDescription = /** @class */ (function () {
    function MerkleTreeDescription(bitsPerPreImage, bitsPerDigest, bitsPerIOp, leafCount) {
        this.bitsPerPreImage = bitsPerPreImage;
        this.bitsPerDigest = bitsPerDigest;
        this.bitsPerIOp = bitsPerIOp;
        this.leafCount = leafCount;
        if (bitsPerDigest > bitsPerIOp) {
            throw Error("Bits per digest, " + bitsPerDigest + ", must not exceed bits per I/O, " + bitsPerIOp);
        }
        this.treeDepth = Math.ceil(Math.log2(leafCount)) + 1;
        this.recordToDigestOffset = Math.pow(2, this.treeDepth - 1) - 1;
        this.subtreeDepth = Math.floor(Math.log2(bitsPerIOp / bitsPerDigest));
        this.subtreeReach = Math.pow(2, this.subtreeDepth);
        this.subtreeWidth = this.subtreeReach / 2;
        this.tierCount = Math.ceil(this.treeDepth / this.subtreeDepth);
        // Reduce the root subtree depth enough that the subtrees for every remaining tier
        // can have maximum depth and accommodate the entire remaining tree.  Maximum tree
        // depth in the formula below is the depth a tree would be if the subtrees at every
        // layer (including the root layer) were at maximum depth.
        //
        // RootSubtreeDepth = DesiredTreeDepth - MaximumTreeDepth + NonRootSubtreeDepth
        this.rootSubtreeDepth = this.treeDepth - (this.tierCount * this.subtreeDepth) + this.subtreeDepth;
        this.rootSubtreeReach = Math.pow(2, this.rootSubtreeDepth);
        this.rootSubtreeWidth = this.rootSubtreeReach / 2;
        var nextSubtreeIndex = 1;
        var layerIndex = this.rootSubtreeDepth;
        var blockMappedRoots = new Array(this.tierCount);
        var blockMappedLeaves = new Array(this.tierCount);
        blockMappedRoots[0] = 0;
        blockMappedLeaves[0] = layerIndex - 1;
        while (layerIndex < this.treeDepth) {
            blockMappedRoots[nextSubtreeIndex] = layerIndex;
            layerIndex += this.subtreeDepth;
            blockMappedLeaves[nextSubtreeIndex++] = layerIndex - 1;
        }
        this.blockMappedRootLayers = blockMappedRoots;
        this.blockMappedLeafLayers = blockMappedLeaves;
    }
    return MerkleTreeDescription;
}());
exports.MerkleTreeDescription = MerkleTreeDescription;
