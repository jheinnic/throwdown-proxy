interface PrizeRecord {
   // Yields 160 bits
   serial: Buffer;
   // Yields 4-bits, stores "nonce modulo 15" for winners, otherwise "0xf" (binary 1111).
   winner: boolean;
   // Yields 10 bits
   prizeTier: number;
   // Yields 18 bits
   tierNonce: number;
   // Yields 32 bits
   shortGameId: Buffer;
}