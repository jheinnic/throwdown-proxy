BigInteger = require('bignumber').BigInteger;
to_arraybuf = require('to-arraybuf');

function Int32ArrayToBigInt(input) {
    return new BigInteger(
      new Uint8Array(input.buffer));
}
          
function bigStringToInt32(input) {
    const bi = new BigInteger(input);
    const bytes = bi.toByteArray();

    // Zero-pad as needed
    switch (bytes.length % 4) {
        case 0: {
            retVal = new Uint32Array(
                to_arraybuf(
                    Buffer.from(bytes)
                )
            );
            break;
        }
        case 1: {
            retVal = new Uint32Array(
                to_arraybuf(
                    Buffer.from([0, 0, 0, ...bytes])
                )
            );
            break;
        }
        case 2: {
            retVal = new Uint32Array(
                to_arraybuf(
                    Buffer.from([0, 0, ...bytes])
                )
            );
            break;
        }
        case 3: {
            retVal = new Uint32Array(
                to_arraybuf(
                    Buffer.from([0, ...bytes])
                )
            );
            break;
        }
    }

    return retVal;
}
