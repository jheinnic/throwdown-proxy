"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forge = {};
var sha256 = forge.sha256 = forge.sha256 || {};
forge.md = forge.md || {};
forge.md.algorithms = forge.md.algorithms || {};
forge.md.sha256 = forge.md.algorithms.sha256 = sha256;
var q = forge;
var l = q.util = q.util || {};
if (typeof process === "undefined" || !process.nextTick) {
    if (typeof setImmediate === "function") {
        l.setImmediate = setImmediate;
        l.nextTick = function (s) { return setImmediate(s); };
    }
    else {
        l.setImmediate = function (s) { setTimeout(s, 0); };
        l.nextTick = l.setImmediate;
    }
}
else {
    l.nextTick = process.nextTick;
    if (typeof setImmediate === "function") {
        l.setImmediate = setImmediate;
    }
    else {
        l.setImmediate = l.nextTick;
    }
}
l.isArray = Array.isArray || function (s) { return Object.prototype.toString.call(s) === "[object Array]"; };
l.ByteBuffer = function (s) { this.data = s || ""; this.read = 0; };
l.ByteBuffer.prototype.length = function () { return this.data.length - this.read; };
l.ByteBuffer.prototype.isEmpty = function () { return this.length() <= 0; };
l.ByteBuffer.prototype.putByte = function (s) { this.data += String.fromCharCode(s); return this; };
l.ByteBuffer.prototype.fillWithByte = function (s, u) { s = String.fromCharCode(s); var t = this.data; while (u > 0) {
    if (u & 1) {
        t += s;
    }
    u >>>= 1;
    if (u > 0) {
        s += s;
    }
} this.data = t; return this; };
l.ByteBuffer.prototype.putBytes = function (s) { this.data += s; return this; };
l.ByteBuffer.prototype.putString = function (s) { this.data += l.encodeUtf8(s); return this; };
l.ByteBuffer.prototype.putInt16 = function (s) { this.data += String.fromCharCode(s >> 8 & 255) + String.fromCharCode(s & 255); return this; };
l.ByteBuffer.prototype.putInt24 = function (s) { this.data += String.fromCharCode(s >> 16 & 255) + String.fromCharCode(s >> 8 & 255) + String.fromCharCode(s & 255); return this; };
l.ByteBuffer.prototype.putInt32 = function (s) { this.data += String.fromCharCode(s >> 24 & 255) + String.fromCharCode(s >> 16 & 255) + String.fromCharCode(s >> 8 & 255) + String.fromCharCode(s & 255); return this; };
l.ByteBuffer.prototype.putInt16Le = function (s) { this.data += String.fromCharCode(s & 255) + String.fromCharCode(s >> 8 & 255); return this; };
l.ByteBuffer.prototype.putInt24Le = function (s) { this.data += String.fromCharCode(s & 255) + String.fromCharCode(s >> 8 & 255) + String.fromCharCode(s >> 16 & 255); return this; };
l.ByteBuffer.prototype.putInt32Le = function (s) { this.data += String.fromCharCode(s & 255) + String.fromCharCode(s >> 8 & 255) + String.fromCharCode(s >> 16 & 255) + String.fromCharCode(s >> 24 & 255); return this; };
l.ByteBuffer.prototype.putInt = function (s, t) { do {
    t -= 8;
    this.data += String.fromCharCode((s >> t) & 255);
} while (t > 0); return this; };
l.ByteBuffer.prototype.putSignedInt = function (s, t) { if (s < 0) {
    s += 2 << (t - 1);
} return this.putInt(s, t); };
l.ByteBuffer.prototype.putBuffer = function (s) { this.data += s.getBytes(); return this; };
l.ByteBuffer.prototype.getByte = function () { return this.data.charCodeAt(this.read++); };
l.ByteBuffer.prototype.getInt16 = function () { var s = (this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1)); this.read += 2; return s; };
l.ByteBuffer.prototype.getInt24 = function () { var s = (this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2)); this.read += 3; return s; };
l.ByteBuffer.prototype.getInt32 = function () { var s = (this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3)); this.read += 4; return s; };
l.ByteBuffer.prototype.getInt16Le = function () { var s = (this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8); this.read += 2; return s; };
l.ByteBuffer.prototype.getInt24Le = function () { var s = (this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16); this.read += 3; return s; };
l.ByteBuffer.prototype.getInt32Le = function () { var s = (this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24); this.read += 4; return s; };
l.ByteBuffer.prototype.getInt = function (t) { var s = 0; do {
    s = (s << 8) + this.data.charCodeAt(this.read++);
    t -= 8;
} while (t > 0); return s; };
l.ByteBuffer.prototype.getSignedInt = function (u) { var t = this.getInt(u); var s = 2 << (u - 2); if (t >= s) {
    t -= s << 1;
} return t; };
l.ByteBuffer.prototype.getBytes = function (s) { var t; if (s) {
    s = Math.min(this.length(), s);
    t = this.data.slice(this.read, this.read + s);
    this.read += s;
}
else {
    if (s === 0) {
        t = "";
    }
    else {
        t = (this.read === 0) ? this.data : this.data.slice(this.read);
        this.clear();
    }
} return t; };
l.ByteBuffer.prototype.bytes = function (s) { return (typeof (s) === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + s)); };
l.ByteBuffer.prototype.at = function (s) { return this.data.charCodeAt(this.read + s); };
l.ByteBuffer.prototype.setAt = function (t, s) { this.data = this.data.substr(0, this.read + t) + String.fromCharCode(s) + this.data.substr(this.read + t + 1); return this; };
l.ByteBuffer.prototype.last = function () { return this.data.charCodeAt(this.data.length - 1); };
l.ByteBuffer.prototype.copy = function () { var s = l.createBuffer(this.data); s.read = this.read; return s; };
l.ByteBuffer.prototype.compact = function () { if (this.read > 0) {
    this.data = this.data.slice(this.read);
    this.read = 0;
} return this; };
l.ByteBuffer.prototype.clear = function () { this.data = ""; this.read = 0; return this; };
l.ByteBuffer.prototype.truncate = function (t) { var s = Math.max(0, this.length() - t); this.data = this.data.substr(this.read, s); this.read = 0; return this; };
l.ByteBuffer.prototype.toHex = function () { var u = ""; for (var t = this.read; t < this.data.length; ++t) {
    var s = this.data.charCodeAt(t);
    if (s < 16) {
        u += "0";
    }
    u += s.toString(16);
} return u; };
l.ByteBuffer.prototype.toString = function () { return l.decodeUtf8(this.bytes()); };
l.createBuffer = function (s, t) { t = t || "raw"; if (s !== undefined && t === "utf8") {
    s = l.encodeUtf8(s);
} return new l.ByteBuffer(s); };
l.fillString = function (v, u) { var t = ""; while (u > 0) {
    if (u & 1) {
        t += v;
    }
    u >>>= 1;
    if (u > 0) {
        v += v;
    }
} return t; };
l.xorBytes = function (y, v, A) { var u = ""; var s = ""; var x = ""; var w = 0; var z = 0; for (; A > 0; --A, ++w) {
    s = y.charCodeAt(w) ^ v.charCodeAt(w);
    if (z >= 10) {
        u += x;
        x = "";
        z = 0;
    }
    x += String.fromCharCode(s);
    ++z;
} u += x; return u; };
l.hexToBytes = function (t) { var u = ""; var s = 0; if (t.length & 1 == 1) {
    s = 1;
    u += String.fromCharCode(parseInt(t[0], 16));
} for (; s < t.length; s += 2) {
    u += String.fromCharCode(parseInt(t.substr(s, 2), 16));
} return u; };
l.bytesToHex = function (s) { return l.createBuffer(s).toHex(); };
l.int32ToBytes = function (s) { return (String.fromCharCode(s >> 24 & 255) + String.fromCharCode(s >> 16 & 255) + String.fromCharCode(s >> 8 & 255) + String.fromCharCode(s & 255)); };
var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var r = [62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
l.encode64 = function (v, z) { var s = ""; var u = ""; var y, w, t; var x = 0; while (x < v.length) {
    y = v.charCodeAt(x++);
    w = v.charCodeAt(x++);
    t = v.charCodeAt(x++);
    s += g.charAt(y >> 2);
    s += g.charAt(((y & 3) << 4) | (w >> 4));
    if (isNaN(w)) {
        s += "==";
    }
    else {
        s += g.charAt(((w & 15) << 2) | (t >> 6));
        s += isNaN(t) ? "=" : g.charAt(t & 63);
    }
    if (z && s.length > z) {
        u += s.substr(0, z) + "\r\n";
        s = s.substr(z);
    }
} u += s; return u; };
l.decode64 = function (t) { t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); var s = ""; var y, x, w, v; var u = 0; while (u < t.length) {
    y = r[t.charCodeAt(u++) - 43];
    x = r[t.charCodeAt(u++) - 43];
    w = r[t.charCodeAt(u++) - 43];
    v = r[t.charCodeAt(u++) - 43];
    s += String.fromCharCode((y << 2) | (x >> 4));
    if (w !== 64) {
        s += String.fromCharCode(((x & 15) << 4) | (w >> 2));
        if (v !== 64) {
            s += String.fromCharCode(((w & 3) << 6) | v);
        }
    }
} return s; };
l.encodeUtf8 = function (s) { return unescape(encodeURIComponent(s)); };
l.decodeUtf8 = function (s) { return decodeURIComponent(escape(s)); };
l.deflate = function (v, t, u) { t = l.decode64(v.deflate(l.encode64(t)).rval); if (u) {
    var w = 2;
    var s = t.charCodeAt(1);
    if (s & 32) {
        w = 6;
    }
    t = t.substring(w, t.length - 4);
} return t; };
l.inflate = function (u, s, t) { var v = u.inflate(l.encode64(s)).rval; return (v === null) ? null : l.decode64(v); };
var i = function (s, v, u) { if (!s) {
    throw { message: "WebStorage not available." };
} var t; if (u === null) {
    t = s.removeItem(v);
}
else {
    u = l.encode64(JSON.stringify(u));
    t = s.setItem(v, u);
} if (typeof (t) !== "undefined" && t.rval !== true) {
    throw t.error;
} };
var k = function (s, u) { if (!s) {
    throw { message: "WebStorage not available." };
} var t = s.getItem(u); if (s.init) {
    if (t.rval === null) {
        if (t.error) {
            throw t.error;
        }
        t = null;
    }
    else {
        t = t.rval;
    }
} if (t !== null) {
    t = JSON.parse(l.decode64(t));
} return t; };
var p = function (t, w, s, u) { var v = k(t, w); if (v === null) {
    v = {};
} v[s] = u; i(t, w, v); };
var h = function (t, v, s) { var u = k(t, v); if (u !== null) {
    u = (s in u) ? u[s] : null;
} return u; };
var j = function (t, x, s) { var v = k(t, x); if (v !== null && s in v) {
    delete v[s];
    var u = true;
    for (var w in v) {
        u = false;
        break;
    }
    if (u) {
        v = null;
    }
    i(t, x, v);
} };
var n = function (s, t) { i(s, t, null); };
var m = function (t, x, z) { var v = null; if (typeof (z) === "undefined") {
    z = ["web", "flash"];
} var y; var u = false; var s = null; for (var A in z) {
    y = z[A];
    try {
        if (y === "flash" || y === "both") {
            if (x[0] === null) {
                throw { message: "Flash local storage not available." };
            }
            else {
                v = t.apply(this, x);
                u = (y === "flash");
            }
        }
        if (y === "web" || y === "both") {
            x[0] = localStorage;
            v = t.apply(this, x);
            u = true;
        }
    }
    catch (w) {
        s = w;
    }
    if (u) {
        break;
    }
} if (!u) {
    throw s;
} return v; };
l.setItem = function (u, w, t, v, s) { m(p, arguments, s); };
l.getItem = function (u, v, t, s) { return m(h, arguments, s); };
l.removeItem = function (u, v, t, s) { m(j, arguments, s); };
l.clearItems = function (t, u, s) { m(n, arguments, s); };
l.parseUrl = function (v) { var u = /^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g; u.lastIndex = 0; var s = u.exec(v); var t = (s === null) ? null : { full: v, scheme: s[1], host: s[2], port: s[3], path: s[4] }; if (t) {
    t.fullHost = t.host;
    if (t.port) {
        if (t.port !== 80 && t.scheme === "http") {
            t.fullHost += ":" + t.port;
        }
        else {
            if (t.port !== 443 && t.scheme === "https") {
                t.fullHost += ":" + t.port;
            }
        }
    }
    else {
        if (t.scheme === "http") {
            t.port = 80;
        }
        else {
            if (t.scheme === "https") {
                t.port = 443;
            }
        }
    }
    t.full = t.scheme + "://" + t.fullHost;
} return t; };
var o = null;
l.getQueryVariables = function (s) { var u = function (y) { var z = {}; var x = y.split("&"); for (var w = 0; w < x.length; w++) {
    var B = x[w].indexOf("=");
    var v;
    var A;
    if (B > 0) {
        v = x[w].substring(0, B);
        A = x[w].substring(B + 1);
    }
    else {
        v = x[w];
        A = null;
    }
    if (!(v in z)) {
        z[v] = [];
    }
    if (!(v in Object.prototype) && A !== null) {
        z[v].push(unescape(A));
    }
} return z; }; var t; if (typeof (s) === "undefined") {
    if (o === null) {
        if (typeof (window) === "undefined") {
            o = {};
        }
        else {
            o = u(window.location.search.substring(1));
        }
    }
    t = o;
}
else {
    t = u(s);
} return t; };
l.parseFragment = function (u) { var t = u; var s = ""; var x = u.indexOf("?"); if (x > 0) {
    t = u.substring(0, x);
    s = u.substring(x + 1);
} var w = t.split("/"); if (w.length > 0 && w[0] === "") {
    w.shift();
} var v = (s === "") ? {} : l.getQueryVariables(s); return { pathString: t, queryString: s, path: w, query: v }; };
l.makeRequest = function (t) { var u = l.parseFragment(t); var s = { path: u.pathString, query: u.queryString, getPath: function (v) { return (typeof (v) === "undefined") ? u.path : u.path[v]; }, getQuery: function (v, w) { var x; if (typeof (v) === "undefined") {
        x = u.query;
    }
    else {
        x = u.query[v];
        if (x && typeof (w) !== "undefined") {
            x = x[w];
        }
    } return x; }, getQueryLast: function (w, v) { var y; var x = s.getQuery(w); if (x) {
        y = x[x.length - 1];
    }
    else {
        y = v;
    } return y; } }; return s; };
l.makeLink = function (v, u, t) { v = jQuery.isArray(v) ? v.join("/") : v; var s = jQuery.param(u || {}); t = t || ""; return v + ((s.length > 0) ? ("?" + s) : "") + ((t.length > 0) ? ("#" + t) : ""); };
l.setPath = function (u, x, y) { if (typeof (u) === "object" && u !== null) {
    var v = 0;
    var t = x.length;
    while (v < t) {
        var w = x[v++];
        if (v == t) {
            u[w] = y;
        }
        else {
            var s = (w in u);
            if (!s || (s && typeof (u[w]) !== "object") || (s && u[w] === null)) {
                u[w] = {};
            }
            u = u[w];
        }
    }
} };
l.getPath = function (v, y, u) { var w = 0; var t = y.length; var s = true; while (s && w < t && typeof (v) === "object" && v !== null) {
    var x = y[w++];
    s = x in v;
    if (s) {
        v = v[x];
    }
} return (s ? v : u); };
l.deletePath = function (t, w) { if (typeof (t) === "object" && t !== null) {
    var u = 0;
    var s = w.length;
    while (u < s) {
        var v = w[u++];
        if (u == s) {
            delete t[v];
        }
        else {
            if (!(v in t) || (typeof (t[v]) !== "object") || (t[v] === null)) {
                break;
            }
            t = t[v];
        }
    }
} };
l.isEmpty = function (s) { for (var t in s) {
    if (s.hasOwnProperty(t)) {
        return false;
    }
} return true; };
l.format = function (z) { var v = /%./g; var u; var t; var s = 0; var y = []; var x = 0; while ((u = v.exec(z))) {
    t = z.substring(x, v.lastIndex - 2);
    if (t.length > 0) {
        y.push(t);
    }
    x = v.lastIndex;
    var w = u[0][1];
    switch (w) {
        case "s":
        case "o":
            if (s < arguments.length) {
                y.push(arguments[s++ + 1]);
            }
            else {
                y.push("<?>");
            }
            break;
        case "%":
            y.push("%");
            break;
        default: y.push("<%" + w + "?>");
    }
} y.push(z.substring(x)); return y.join(""); };
l.formatNumber = function (x, v, C, w) { var u = x, B = isNaN(v = Math.abs(v)) ? 2 : v; var A = C === undefined ? "," : C; var D = w === undefined ? "." : w, E = u < 0 ? "-" : ""; var z = parseInt((u = Math.abs(+u || 0).toFixed(B)), 10) + ""; var y = (z.length > 3) ? z.length % 3 : 0; return E + (y ? z.substr(0, y) + D : "") + z.substr(y).replace(/(\d{3})(?=\d)/g, "$1" + D) + (B ? A + Math.abs(u - z).toFixed(B).slice(2) : ""); };
l.formatSize = function (s) { if (s >= 1073741824) {
    s = l.formatNumber(s / 1073741824, 2, ".", "") + " GiB";
}
else {
    if (s >= 1048576) {
        s = l.formatNumber(s / 1048576, 2, ".", "") + " MiB";
    }
    else {
        if (s >= 1024) {
            s = l.formatNumber(s / 1024, 0) + " KiB";
        }
        else {
            s = l.formatNumber(s, 0) + " bytes";
        }
    }
} return s; };
l.bytesFromIP = function (s) { if (s.indexOf(".") !== -1) {
    return l.bytesFromIPv4(s);
} if (s.indexOf(":") !== -1) {
    return l.bytesFromIPv6(s);
} return null; };
l.bytesFromIPv4 = function (v) { v = v.split("."); if (v.length !== 4) {
    return null;
} var s = l.createBuffer(); for (var u = 0; u < v.length; ++u) {
    var t = parseInt(v[u], 10);
    if (isNaN(t)) {
        return null;
    }
    s.putByte(t);
} return s.getBytes(); };
l.bytesFromIPv6 = function (x) { var w = 0; x = x.split(":").filter(function (y) { if (y.length === 0) {
    ++w;
} return true; }); var u = (8 - x.length + w) * 2; var s = l.createBuffer(); for (var v = 0; v < 8; ++v) {
    if (!x[v] || x[v].length === 0) {
        s.fillWithByte(0, u);
        u = 0;
        continue;
    }
    var t = l.hexToBytes(x[v]);
    if (t.length < 2) {
        s.putByte(0);
    }
    s.putBytes(t);
} return s.getBytes(); };
l.bytesToIP = function (s) { if (s.length === 4) {
    return l.bytesToIPv4(s);
} if (s.length === 16) {
    return l.bytesToIPv6(s);
} return null; };
l.bytesToIPv4 = function (s) { if (s.length !== 4) {
    return null;
} var u = []; for (var t = 0; t < s.length; ++t) {
    u.push(s.charCodeAt(t));
} return u.join("."); };
l.bytesToIPv6 = function (A) { if (A.length !== 16) {
    return null;
} var u = []; var z = []; var v = 0; for (var t = 0; t < A.length; t += 2) {
    var s = l.bytesToHex(A[t] + A[t + 1]);
    while (s[0] === "0" && s !== "0") {
        s = s.substr(1);
    }
    if (s === "0") {
        var y = z[z.length - 1];
        var w = u.length;
        if (!y || w !== y.end + 1) {
            z.push({ start: w, end: w });
        }
        else {
            y.end = w;
            if ((y.end - y.start) > (z[v].end - z[v].start)) {
                v = z.length - 1;
            }
        }
    }
    u.push(s);
} if (z.length > 0) {
    var x = z[v];
    if (x.end - x.start > 0) {
        u.splice(x.start, x.end - x.start + 1, "");
        if (x.start === 0) {
            u.unshift("");
        }
        if (x.end === 7) {
            u.push("");
        }
    }
} return u.join(":"); };
function _init() { _padding = String.fromCharCode(128), _padding += forge.util.fillString(String.fromCharCode(0), 64), _k = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], _initialized = !0; }
function _update(e, t, h) { for (var n, r, g, a, u, l, i, f, s, o, d, p, L, c, _, m = h.length(); m >= 64;) {
    for (i = 0; 16 > i; ++i)
        t[i] = h.getInt32();
    for (; 64 > i; ++i)
        n = t[i - 2], n = (n >>> 17 | n << 15) ^ (n >>> 19 | n << 13) ^ n >>> 10, r = t[i - 15], r = (r >>> 7 | r << 25) ^ (r >>> 18 | r << 14) ^ r >>> 3, t[i] = n + t[i - 7] + r + t[i - 16] | 0;
    for (f = e.h0, s = e.h1, o = e.h2, d = e.h3, p = e.h4, L = e.h5, c = e.h6, _ = e.h7, i = 0; 64 > i; ++i)
        a = (p >>> 6 | p << 26) ^ (p >>> 11 | p << 21) ^ (p >>> 25 | p << 7), u = c ^ p & (L ^ c), g = (f >>> 2 | f << 30) ^ (f >>> 13 | f << 19) ^ (f >>> 22 | f << 10), l = f & s | o & (f ^ s), n = _ + a + u + _k[i] + t[i], r = g + l, _ = c, c = L, L = p, p = d + n >>> 0, d = o, o = s, s = f, f = n + r >>> 0;
    e.h0 = e.h0 + f | 0, e.h1 = e.h1 + s | 0, e.h2 = e.h2 + o | 0, e.h3 = e.h3 + d | 0, e.h4 = e.h4 + p | 0, e.h5 = e.h5 + L | 0, e.h6 = e.h6 + c | 0, e.h7 = e.h7 + _ | 0, m -= 64;
} }
sha256.create = function () { _initialized || _init(); var e = null, t = forge.util.createBuffer(), h = new Array(64), n = { algorithm: "sha256", blockLength: 64, digestLength: 32, messageLength: 0, fullMessageLength: null, messageLengthSize: 8 }; return n.start = function () { n.messageLength = 0, n.fullMessageLength = n.messageLength64 = []; for (var h = n.messageLengthSize / 4, r = 0; h > r; ++r)
    n.fullMessageLength.push(0); return t = forge.util.createBuffer(), e = { h0: 1779033703, h1: 3144134277, h2: 1013904242, h3: 2773480762, h4: 1359893119, h5: 2600822924, h6: 528734635, h7: 1541459225 }, n; }, n.start(), n.update = function (r, g) { "utf8" === g && (r = forge.util.encodeUtf8(r)); var a = r.length; n.messageLength += a, a = [a / 4294967296 >>> 0, a >>> 0]; for (var u = n.fullMessageLength.length - 1; u >= 0; --u)
    n.fullMessageLength[u] += a[1], a[1] = a[0] + (n.fullMessageLength[u] / 4294967296 >>> 0), n.fullMessageLength[u] = n.fullMessageLength[u] >>> 0, a[0] = a[1] / 4294967296 >>> 0; return t.putBytes(r), _update(e, h, t), (t.read > 2048 || 0 === t.length()) && t.compact(), n; }, n.digest = function () { var n = forge.util.createBuffer(); n.putBytes(t.bytes()); var r = { h0: e.h0, h1: e.h1, h2: e.h2, h3: e.h3, h4: e.h4, h5: e.h5, h6: e.h6, h7: e.h7 }; _update(r, h, n); var g = forge.util.createBuffer(); return g.putInt32(r.h0), g.putInt32(r.h1), g.putInt32(r.h2), g.putInt32(r.h3), g.putInt32(r.h4), g.putInt32(r.h5), g.putInt32(r.h6), g.putInt32(r.h7), g; }, n; };
var _padding = null, _initialized = !1, _k = null;
function SHA256Compress(buf) {
    //stupid manipulations because of stupid deprecation of binary format in nodejs
    var hash = sha256.create();
    hash.update(String.fromCharCode.apply(null, buf));
    var hash = hash.digest().data;
    var l = hash.length;
    var b = new Buffer(l);
    for (var i = 0; i < l; i++) {
        b[i] = hash.charCodeAt(i);
    }
    ;
    return b;
}
exports.SHA256Compress = SHA256Compress;
;
/* tests
var buf=Buffer.concat([new Buffer('c65e8ed445c3e6456320735348c9835a3e7265de13655c549dbdbce2ad0dec2d','hex'),new Buffer('0000000000000000000000000000000000000000000000000000000000000000','hex')])
console.log(SHA256Compress(buf).toString('hex'));
//9a20b2f42391d61fa598dce28efe02e755ea06cc10d498e6124a1df9480c4f00
*/
