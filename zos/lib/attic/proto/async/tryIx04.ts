import * as fs from 'fs';
import * as util from 'util';
import {AsyncSink} from 'ix/asyncsink';
import {go, sleep} from 'medium';
import {AsyncIterableX} from 'ix/asynciterable';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/share';

const pReadFile = util.promisify(fs.readFile);

// class Source implements AsyncIterable<number>
// {
//    [Symbol.asyncIterator](): AsyncIterator<number>
//    {
//       return readFiles();
//    }
// }

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

const sources: AsyncIterableX<number> = AsyncIterableX.create(readFiles)
   .share();

const pipeline: AsyncSink<number> = new AsyncSink<number>();


async function doWork(task: number): Promise<void>
{
   console.log('Begin ' + task);
   await sleep(1250);
   console.log('Finish ' + task);
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

sources.forEach(
   async (value: number) => {
      await doWork(value);
      pipeline.write(value);
   }
)
   .then(function () {
      console.log('Exit from worker loop');
   })
   .catch(function (err: any) {
      console.error('Exit from worker loop with error:', err);
   });

sources.forEach(
   async (value: number) => {
      await doWork(value);
      pipeline.write(value);
   }
)
   .then(function () {
      console.log('Exit from worker loop');
   })
   .catch(function (err: any) {
      console.error('Exit from worker loop with error:', err);
   });
