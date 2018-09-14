import {NodeCryptoRandomSource} from '../node-crypto-random-source.service';
import {of, range} from 'rxjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import {bufferCount, map, tap} from 'rxjs/operators';

const randomSource = new NodeCryptoRandomSource();

/*
range(0, 100)
   .pipe(
      randomSource.withPseudoRandomBuffer(NEVER, 32),
      scan(
         (last: { buffer: Buffer, count: number }, next: Buffer) => (
            {
               buffer: next,
               count: last.count + 1
            }
         ),
         {
            buffer: Buffer.alloc(0),
            count: 0
         }
      )
   )
   .subscribe(function (nextValue) {
      console.log(nextValue);
   });
*/

const writeHandle =
   fs.createWriteStream(
      'dataHeap.dat', {
         flags: 'w',
         mode: 0o0644,
         autoClose: true
      });

range(0, 1900005)
// range(0, 640)
   .pipe(
      randomSource.withPseudoRandomBuffer(
         of(
            crypto.randomBytes(1024)
            // queueScheduler
         ),
         256
      ),
      // scan(
      //    (last: { buffer: Buffer, count: number }, next: Buffer) => (
      //       {
      //          buffer: next,
      //          count: last.count + 1
      //       }
      //    ),
      //    {
      //       buffer: Buffer.alloc(0),
      //       count: 0
      //    }
      // )
      map((pass) => {
         // console.log('one', pass);
         return pass[1];
      }),
      bufferCount(85),
      map((pass: Buffer[]) => {
         // console.log('two', pass);
         return pass.reduce((previousValue, currentValue, index) => {
            previousValue.fill(currentValue, index * 256);
            return previousValue;
         }, Buffer.alloc(85 * 256));
      }),
      tap((pass: Buffer[]) => {
         console.log('three', pass.length);
      })
   )
   .subscribe(function (nextValue) {
      // console.log(nextValue[0], nextValue[1].hexSlice(0));
      // fs.writeFileSync("dataHeap.dat", nextValue[1]);
      writeHandle.write(nextValue, function (a: any, b: any, c: any) {
         console.log('Returned from write'
            + ' with', a, b, c);
      });
   });