"use strict";
exports.__esModule = true;
var ethereumjs_util_1 = require("ethereumjs-util");
var MerkleTree = /** @class */ (function () {
    function MerkleTree(elements) {
        // Filter empty strings and hash elements
        this.elements = elements.filter(function (el) { return el; }).map(function (el) { return ethereumjs_util_1.sha3(el); });
        // Deduplicate elements
        this.elements = this.bufDedup(this.elements);
        // Sort elements
        this.elements.sort(Buffer.compare);
        // Create layers
        this.layers = this.getLayers(this.elements);
    }
    MerkleTree.prototype.getLayers = function (elements) {
        if (elements.length === 0) {
            return [['']];
        }
        var layers = [];
        layers.push(elements);
        // Get next layer until we reach the root
        while (layers[layers.length - 1].length > 1) {
            layers.push(this.getNextLayer(layers[layers.length - 1]));
        }
        return layers;
    };
    MerkleTree.prototype.getNextLayer = function (elements) {
        var _this = this;
        return elements.reduce(function (layer, el, idx, arr) {
            if (idx % 2 === 0) {
                // Hash the current element with its pair element
                layer.push(_this.combinedHash(el, arr[idx + 1]));
            }
            return layer;
        }, []);
    };
    MerkleTree.prototype.combinedHash = function (first, second) {
        if (!first) {
            return second;
        }
        if (!second) {
            return first;
        }
        return ethereumjs_util_1.sha3(this.sortAndConcat(first, second));
    };
    MerkleTree.prototype.getRoot = function () {
        return this.layers[this.layers.length - 1][0];
    };
    MerkleTree.prototype.getHexRoot = function () {
        return ethereumjs_util_1.bufferToHex(this.getRoot());
    };
    MerkleTree.prototype.getProof = function (el, prefix) {
        var _this = this;
        var idx = this.bufIndexOf(el, this.elements);
        if (idx === -1) {
            throw new Error('Element does not exist in Merkle tree');
        }
        var proof = this.layers.reduce(function (proof, layer) {
            var pairElement = _this.getPairElement(idx, layer);
            if (pairElement) {
                proof.push(pairElement);
            }
            idx = Math.floor(idx / 2);
            return proof;
        }, []);
        if (prefix) {
            if (!Array.isArray(prefix)) {
                prefix = [prefix];
            }
            prefix = prefix.map(function (item) { return ethereumjs_util_1.setLength(ethereumjs_util_1.toBuffer(item), 32); });
            proof = prefix.concat(proof);
        }
        return proof;
    };
    MerkleTree.prototype.getHexProof = function (el, prefix) {
        var proof = this.getProof(el, prefix);
        return this.bufArrToHex(proof);
    };
    MerkleTree.prototype.getPairElement = function (idx, layer) {
        var pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
        if (pairIdx < layer.length) {
            return layer[pairIdx];
        }
        else {
            return null;
        }
    };
    MerkleTree.prototype.bufIndexOf = function (el, arr) {
        var hash;
        // Convert element to 32 byte hash if it is not one already
        if (el.length !== 32 || !Buffer.isBuffer(el)) {
            hash = ethereumjs_util_1.sha3(el);
        }
        else {
            hash = el;
        }
        for (var i = 0; i < arr.length; i++) {
            if (hash.equals(arr[i])) {
                return i;
            }
        }
        return -1;
    };
    MerkleTree.prototype.bufDedup = function (elements) {
        var _this = this;
        return elements.filter(function (el, idx) {
            return _this.bufIndexOf(el, elements) === idx;
        });
    };
    MerkleTree.prototype.bufArrToHex = function (arr) {
        if (arr.some(function (el) { return !Buffer.isBuffer(el); })) {
            throw new Error('Array is not an array of buffers');
        }
        return '0x' + arr.map(function (el) { return el.toString('hex'); }).join('');
    };
    MerkleTree.prototype.sortAndConcat = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Buffer.concat(args.slice().sort(Buffer.compare));
    };
    return MerkleTree;
}());
exports.MerkleTree = MerkleTree;
