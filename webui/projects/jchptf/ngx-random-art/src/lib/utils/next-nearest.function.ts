/**
 * Return the next representable double from value towards direction
 * This logic is written with an assumption of Little-Endianess.  If it
 * needs to consider Big-Endian architectures, revision will be required!
 */
export function nextNearest(value: number, direction: number): number
{
  if (typeof value !== 'number' || typeof direction !== 'number') {
    return NaN;
  }

  if (isNaN(value) || isNaN(direction)) {
    return NaN;
  }

  if (!isFinite(value)) {
    return value;
  }

  if (value === direction) {
    return value;
  }

  const buffer = new ArrayBuffer(8);
  const f64 = new Float64Array(buffer);
  const u32 = new Uint32Array(buffer);

  f64[0] = value;

  if (value === 0) {
    u32[0] = 1;
    u32[1] = direction < 0 ? 1 << 31 : 0;
  } else if ((
    (value > 0) && (value < direction)
  ) || (
    (value < 0) && (value > direction)
  ))
  {
    if (u32[0]++ === 0xFFFFFFFF) {
      u32[1]++;
    }
  } else {
    if (u32[0]-- === 0) {
      u32[1]--;
    }
  }

  return f64[0];
}
