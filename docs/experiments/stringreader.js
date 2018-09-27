"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var buffer_1 = require("buffer");
/**
 * A Readable stream for a string or Buffer.
 *
 * This works for both strings and Buffers.
 */
var StringReader = /** @class */ (function (_super) {
    tslib_1.__extends(StringReader, _super);
    function StringReader(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
    }
    StringReader.prototype.open = function () {
        if (this.encoding && buffer_1.Buffer.isBuffer(this.data)) {
            this.emit('data', this.data.toString(this.encoding));
        }
        else {
            this.emit('data', this.data);
        }
        this.emit('end');
        this.emit('close');
    };
    StringReader.prototype.setEncoding = function (encoding) {
        this.encoding = encoding;
    };
    StringReader.prototype.pause = function () {
    };
    StringReader.prototype.destroy = function () {
        this.data = undefined;
        delete this.data;
    };
    return StringReader;
}(stream_1.Stream));
exports.StringReader = StringReader;
//# sourceMappingURL=stringreader.js.map