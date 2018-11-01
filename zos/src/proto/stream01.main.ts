// @ts-ignore
import * as cs from 'co-stream';
import * as util from 'util';
import * as fs from 'fs';

const dir = '/Users/jheinnic/Documents/randomArt3/pkFixture3';

fs.createReadStream(`${dir}/keys.dat`, {flags: 'r'})
   .pipe(cs.split())
   .pipe(cs.object.each(function *(line: string) {
      //do something with the line
      const publicKey = `${dir}/keys/${line}.public`;
      console.log(publicKey);
      return fs.createReadStream(publicKey)
         .pipe(cs.object.map(function *(line: string) {
            const tokens = line.split(':');
            return [Buffer.from(tokens[0]), Buffer.from(tokens[1])]
         }, {objectMode: true, parallel: 2} ))
         .pipe(cs.object.each(function *(buffers: Buffer[]): IterableIterator<any> {
            // @ts-ignore
            console.log(buffers[0].hexSlice(0));
            // @ts-ignore
            console.log(buffers[1].hexSlice(0));
         }, {objectMode: true, parallel: 1}));
   }, {objectMode: true, parallel: 4}))
