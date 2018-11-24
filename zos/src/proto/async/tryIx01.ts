import * as fs from 'fs';
import * as util from 'util';
import {AsyncSink} from 'ix/asyncsink';
import {go, sleep} from 'medium';
import {AsyncIterableX} from 'ix/asynciterable';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/share';

const pReadFile = util.promisify(fs.readFile);

class Source implements AsyncIterable<number>
{
   [Symbol.asyncIterator](): AsyncIterator<number>
   {
      return readFiles();
   }
}

async function* readFiles(): AsyncIterableIterator<number>
{
   let counter = 0;
   while (++counter > 0) {
      // console.log('Reading ' + counter);
      const data = await pReadFile('tryMedium06.js');
      console.log('Yielding ' + counter);
      yield counter + data.byteLength;
      // console.log('Looping after ' + counter);
   }
}

const sources: AsyncIterableX<number> = AsyncIterableX.from(
   new Source()
)
   .share();

const pipeline: AsyncSink<number> = new AsyncSink<number>();

class Worker
{
   constructor(private readonly workerId: number)
   {
      sources.forEach(
         async (value: number) => {
            await this.doWork(value);
            pipeline.write(value);
         }
      )
         .then(function () {
            console.log('Exit from worker loop');
         })
         .catch(function (err: any) {
            console.error('Exit from worker loop with error:', err);
         });
   }

   async doWork(task: number): Promise<void>
   {
      console.log('Begin ' + task + ' on worker ' + this.workerId);
      await sleep(1250);
      console.log('Finish ' + task + ' on worker ' + this.workerId);
   }
}

go(async function () {
   for await (let result of pipeline) {
      console.log('Result: ', result);
   }
})
   .then(function () {
      console.log('Exit from main loop');
   })
   .catch(function (err: any) {
      console.error('Exit from main loop with error:', err);
   });

const _w1: Worker = new Worker(1);
const _w2: Worker = new Worker(2);

if (!_w1 || !_w2) {
   console.error('Creation problem');
}
