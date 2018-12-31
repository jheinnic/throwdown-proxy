import {mapAsync} from 'ix/iterable/mapasync';
import {buffers, chan, Chan, put, take, sleep} from 'medium';

const workerChannel: Chan = chan(buffers.fixed(1));
const resultChannel: Chan = chan(buffers.fixed(1));

(async function main()
{
   console.log('W: Putting initial on work channel 0');
   await put(workerChannel, 0);
   // await put(workerChannel, 0);

   const xs = [1, 2, 3, 4];
   const mapped = mapAsync(xs, async (item, index) => {
      console.log('WM: Enter map');
      const retVal = item * index;
      console.log('WM: Sending return value on 0');
      return retVal;
   });

   for await (let item of mapped) {
      console.log(`WI: Finished previous: ${item}`); // ${system.currentTimeMillis()}`);
      await put(resultChannel, item);
      console.log('WI: Put result on channel');
      await sleep(500);
      console.log('WI: Woke from sleep');
      await take(workerChannel);
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
      result = await take(resultChannel);
      console.log('C: Returning worker after result');
      await put(workerChannel, result);
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
