/**
 * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
 *
 * @param multiplicand
 * @param maxDivisor
 */
export function findOptimalDivisor(multiplicand: number, maxDivisor: number): number
{
  if ((multiplicand % maxDivisor) === 0)
  {
    return maxDivisor;
  }

  let ii;
  const sqrt = Math.floor(Math.sqrt(multiplicand));
  if (sqrt > maxDivisor) {
    for (ii = maxDivisor; ii > 1; ii--) {
      if ((multiplicand % ii) === 0)
      {
        return ii;
      }
    }

    return 1;
  } else {
    let highLowHigh = 0;
    for (ii = sqrt; highLowHigh === 0; ii--) {
      if ((multiplicand % ii) === 0)
      {
        highLowHigh = ii;
      }
    }

    let firstFound = true;
    let lowLowHigh = 0;
    for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++)
    {
      if ((multiplicand % ii) === 0)
      {
        lowLowHigh = multiplicand / ii;
        if (lowLowHigh > maxDivisor) {
          lowLowHigh = 0;
          firstFound = false;
        }
      }
    }

    if ((lowLowHigh > 0) && firstFound)
    {
      return lowLowHigh;
    }

    const altHighLowHigh = multiplicand / highLowHigh;
    if (altHighLowHigh <= maxDivisor) {
      highLowHigh = altHighLowHigh;
    }

    if (lowLowHigh > highLowHigh) {
      highLowHigh = lowLowHigh;
    }

    return highLowHigh;
  }
}
