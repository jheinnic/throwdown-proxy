import {Observable, OperatorFunction, queueScheduler} from 'rxjs';
import {map, observeOn, withLatestFrom} from 'rxjs/operators';
import {BitInputStream, BitOutputStream} from '@thi.ng/bitstream';

import {PseudoRandomSource} from '../../infrastructure/randomize/interface/pseudo-random-source.interface';
import {IsaacCSPRNG} from '../../infrastructure/randomize/sources/isaac-csprng.class';

// interface ByteGeneratorState {
//    readonly generator: IsaacCSPRNG,
//    readonly writeBuf: BitOutputStream,
//    readonly readBuf: BitInputStream
// }

const INT32_OVERFLOW = Math.pow(2, 33);

// function ToUint32(x: number): number {
//    return x - (Math.floor(x / INT31_OVERFLOW) * INT31_OVERFLOW);
// }

export class IsaacRxjsService
{

   public withPseudoRandomBuffer<T>(
      seedSource: Observable<Buffer>, byteCount: number): OperatorFunction<T, [T, Buffer]>
   {
      return function (source: Observable<T>): Observable<[T, Buffer]> {
         return source.pipe(
            // observeOn(queueScheduler),
            withLatestFrom<T, IsaacCSPRNG>(
               seedSource.pipe(
                  map<Buffer, IsaacCSPRNG>(
                     // Transform each seed Buffer into an ISAAC PRNG.
                     function(seedBytes: Buffer): IsaacCSPRNG {
                        const wordCount: number = (seedBytes.length - seedBytes.length % 4) / 4;
                        const writeBuf: BitOutputStream = new BitOutputStream();
                        writeBuf.writeWords(seedBytes, 8);
                        const readBuf: BitInputStream = writeBuf.reader();
                        const words: number[] = readBuf.readWords(wordCount, 32);
                        return new IsaacCSPRNG(words);
                     }
                  )
               )
            ),
            map<[T, IsaacCSPRNG], [T, Buffer]>(
               function(pair: [T, IsaacCSPRNG]): [T, Buffer] {
                  return [pair[0], Buffer.from(
                     pair[1].bytes(byteCount).buffer
                  )];
               }
            )
         )
      }
   }

   /*
   public withPseudoRandomBuffer<T>(
      seedSource: Observable<Buffer>, byteCount: number): OperatorFunction<T, [T, Buffer]>
   {
      return function (source: Observable<T>): Observable<[T, Buffer]> {
         return source.pipe(
            // observeOn(queueScheduler),
            withLatestFrom<T, Buffer>(
               seedSource.pipe(
                  switchMap<Buffer, Buffer>(
                     // Until seedSource emits a new Buffer, produce a stream of Buffers
                     // derived from an ISAAC PRNG seeded with most recent seed buffer.
                     function(seedBytes: Buffer): Observable<Buffer> {
                        let writeBuf: BitOutputStream = new BitOutputStream();
                        writeBuf.writeWords(seedBytes, 8);
                        let readBuf: BitInputStream = writeBuf.reader();

                        const wordCount: number = (seedBytes.length - seedBytes.length % 4) / 4;
                        const words: number[] = readBuf.readWords(wordCount, 32);
                        const generator = new IsaacCSPRNG(words);

                        // console.log(generator);

                        writeBuf = new BitOutputStream(4);
                        writeBuf.write(generator.int32(), 32);
                        readBuf = writeBuf.reader();

                        return generate({
                           initialState: {
                              generator: generator,
                              writeBuf: writeBuf,
                              readBuf: readBuf
                           },
                           iterate: function(state: ByteGeneratorState) {
                              if (state.readBuf.position >= 32) {
                                 readBuf.seek(0);
                                 writeBuf.seek(0);
                                 writeBuf.write(generator.int32(), 32);
                                 // console.log(writeBuf, generator.accumulator, generator.count, generator.counter);
                              }

                              return state;
                           },
                           resultSelector: function(state: ByteGeneratorState) {
                              const retVal = state.readBuf.read(8);
                              // console.log(retVal, state.readBuf);
                              return retVal;
                           }
                           // scheduler: queueScheduler
                        }).pipe(
                           bufferCount(byteCount),
                           map(function(bytes: number[]) {
                              return Buffer.from(bytes);
                           }),
                           tap((byte) => { console.log(byte.hexSlice(0)); }),
                        );
                     }
                  )
               )
            )
         )
      }
   }
   */

   public withPseudoRandomInteger<T>(
      seedSource: Observable<Buffer>, minValue: number, maxValue: number): OperatorFunction<T, [T, number]>
   {
      if (minValue >= maxValue) {
         throw new Error(`maxValue, ${maxValue}, must be at least one greater than minValue, ${minValue}`);
      }

      const range = maxValue - minValue;
      if (range > INT32_OVERFLOW) {
         throw new Error(`Can only ensure integers over a range no greater than ${INT32_OVERFLOW} wide, which excludes ${range}`);
      }

      return function (source: Observable<T>): Observable<[T, number]> {
         return source.pipe(
            observeOn(queueScheduler),
            withLatestFrom<T, IsaacCSPRNG>(
               seedSource.pipe(
                  map<Buffer, IsaacCSPRNG>(
                     // Transform each seed Buffer into an ISAAC PRNG.
                     function(seedBytes: Buffer): IsaacCSPRNG {
                        const wordCount: number = (seedBytes.length - seedBytes.length % 4) / 4;
                        const writeBuf: BitOutputStream = new BitOutputStream();
                        writeBuf.writeWords(seedBytes, 8);
                        const readBuf: BitInputStream = writeBuf.reader();
                        const words: number[] = readBuf.readWords(wordCount, 32);
                        return new IsaacCSPRNG(words);
                     }
                  )
               )
            ),
            map<[T, IsaacCSPRNG], [T, number]>(
               function(pair: [T, IsaacCSPRNG]): [T, number] {
                  let nextResult = pair[1].int32();
                  return [pair[0], (nextResult % range) + minValue];
               }
            )
         );
      };
   }
}
