"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
 *
 * @param multiplicand
 * @param maxDivisor
 */
function findOptimalDivisor(multiplicand, maxDivisor) {
    if ((multiplicand % maxDivisor) === 0) {
        return maxDivisor;
    }
    var ii;
    var sqrt = Math.floor(Math.sqrt(multiplicand));
    if (sqrt > maxDivisor) {
        for (ii = maxDivisor; ii > 1; ii--) {
            if ((multiplicand % ii) === 0) {
                return ii;
            }
        }
        return 1;
    }
    else {
        var highLowHigh = 0;
        for (ii = sqrt; highLowHigh === 0; ii--) {
            if ((multiplicand % ii) === 0) {
                highLowHigh = ii;
            }
        }
        var firstFound = true;
        var lowLowHigh = 0;
        for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++) {
            if ((multiplicand % ii) === 0) {
                lowLowHigh = multiplicand / ii;
                if (lowLowHigh > maxDivisor) {
                    lowLowHigh = 0;
                    firstFound = false;
                }
            }
        }
        if ((lowLowHigh > 0) && firstFound) {
            return lowLowHigh;
        }
        var altHighLowHigh = multiplicand / highLowHigh;
        if (altHighLowHigh <= maxDivisor) {
            highLowHigh = altHighLowHigh;
        }
        if (lowLowHigh > highLowHigh) {
            highLowHigh = lowLowHigh;
        }
        return highLowHigh;
    }
}
exports.findOptimalDivisor = findOptimalDivisor;
//# sourceMappingURL=find-optimal-divisor.function.js.map