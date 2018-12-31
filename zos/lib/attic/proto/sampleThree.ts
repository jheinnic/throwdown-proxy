import {AsyncSink} from 'ix';
import {mapAsync} from 'ix/iterable/mapasync';
import {sleep} from 'medium';

const workerChannel: AsyncSink<number> = new AsyncSink<number>();
const resultChannel: AsyncSink<number> = new AsyncSink<number>();

(async function main()
{
   console.log('Putting initial on work channel 0');
   // await put(workerChannel, 0);
   workerChannel.write(0);

   const xs = [1, 2, 3, 4];
   const mapped = mapAsync(xs, async (item, index) => {
      console.log('WM: Enter map');
      const retVal = item * index;
      console.log('WM: Sending return value on 0');
      return retVal;
   });

   for await (let item of mapped) {
      console.log(`WI: Finished previous: ${item}`); // ${system.currentTimeMillis()}`);
      resultChannel.write(item);
      console.log('WI: Put result on channel');
      await sleep(500);
      console.log('WI: Woke from sleep');
      item = (await workerChannel.next()).value;
      console.log(`WI: Took next: ${item}`);
   }
})( ).then(
   (value: any) => { console.log(`next: ${value}`); }
).catch(
   (err: any) => { console.error(`error: ${err}`); }
);

(async function main()
{
   let result;
   for (let ii=0; ii<5; ii++) {
      console.log('C: Waiting for result');
      result = (await resultChannel.next()).value;
      console.log('C: Returning worker after result:', result);
      workerChannel.write(result);
      console.log('C: Worker has been returned');
   }
})( ).then(
   (value: any) => { console.log(`next: ${value}`); }
).catch(
   (err: any) => { console.error(`error: ${err}`); }
);

setTimeout(() => {
   console.log('Exitting...');
}, 60000);
