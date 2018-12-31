import * as fs from 'fs';
import * as util from 'util';
import {go, sleep} from 'medium';
import {AsyncIterableX} from 'ix/asynciterable';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/share';

const pReadFile = util.promisify(fs.readFile);

async function* readFiles(): AsyncIterableIterator<number>
{
   let counter = 0;
   while (++counter > 0) {
      // console.log('Reading ' + counter);
      const data = await pReadFile('tryMedium06.js');
      console.log('Yielding ' + (counter + data.byteLength));
      yield counter + data.byteLength;
      // console.log('Looping after ' + counter);
   }
}

const oneSource = AsyncIterableX.create(readFiles);
const sources: AsyncIterableX<number> = AsyncIterableX.merge(
   oneSource, AsyncIterableX.create(readFiles).share(), oneSource.share()
).share();

// const pipeline: AsyncSink<number> = new AsyncSink<number>();


async function doWork(task: number): Promise<void>
{
   // console.log('Begin ' + task);
   await sleep(task);
   // console.log('Finish ' + task);
}

const pipeline = AsyncIterableX.merge(
   sources.map(
      async (value: number) => {
         await doWork(1);
         console.log('Grok: ' + value)
         return value;
      }
   ),
   sources.map(
      async (value: number) => {
         await doWork(1);
         console.log('Gruk: ' + value)
         return value;
      }
   )
);

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
