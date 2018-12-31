import * as fs from 'fs';
import {Writable} from 'stream';

const recordSize = 256;
const heapFile = './dataHeap.dat';

let dataInBuffer: number = 0;
const partialRecBuffer = Buffer.alloc(recordSize);

const src = fs.createReadStream(heapFile);
const outStream = new Writable({
   decodeStrings: false,
   write(chunk, _, callback) {
      let length = (chunk.length + dataInBuffer) >= recordSize ? recordSize - dataInBuffer : chunk.length;
      partialRecBuffer.fill(chunk, dataInBuffer, length);
      chunk = chunk.slice(length);
      dataInBuffer += length;

      while(dataInBuffer === recordSize) {
         const bufHex = (partialRecBuffer as any).hexSlice(0);
         console.log(bufHex);
         dataInBuffer = (chunk.length > recordSize) ? recordSize : chunk.length;
         partialRecBuffer.fill(chunk, 0, dataInBuffer);
         chunk = chunk.slice(dataInBuffer);
      }

      callback();
   }
});

src.pipe(outStream);

