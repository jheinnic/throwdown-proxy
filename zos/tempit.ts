import { Subject, range, zip, asapScheduler, asyncScheduler } from 'rxjs';
import { bufferCount, flatMap, map, mapTo, observeOn, take, tap } from 'rxjs/operators';

const control = new Subject();
const source = range(0, 100, asyncScheduler);

const feed = control.pipe(
   observeOn(asyncScheduler)
);

const workSub = zip(source, feed).pipe(
   map( (input) => {
      console.log(`Read ${input[0]} using guard ${input[1]}`);
      return input[1];
   })
).subscribe(control);

control.next('One');
control.next('Two');

new Promise((resolve, reject) => {
}).then(() => {
    console.log('Done');
}).catch((err) => {
    console.error(err);
});

