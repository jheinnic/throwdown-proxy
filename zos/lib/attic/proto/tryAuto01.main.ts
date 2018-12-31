import {AutoIterate} from '../infrastructure/lib';
// @ts-ignore
import {asapScheduler, asyncScheduler, Subject} from 'rxjs';
import chan = require('chan');
import {co} from 'co';
import Queue from 'co-priority-queue';
import {ConcurrentWorkFactory} from '@jchptf/coroutines';

const autoIter = new AutoIterate(
   asyncScheduler, new ConcurrentWorkFactory());

const source = [1, 2, 3, 4, 5];

function director(arg: number): void {
   console.log(arg);
}

const ch: Chan.Chan<number> = chan();

const subject: Subject<number> = new Subject<number>();

const q: Queue<number> = new Queue<number>();

// @ts-ignore
const subscription1 = autoIter.run(source, director, 250);
// @ts-ignore
const subscription2 = autoIter.run(source, ch, 250);
// @ts-ignore
const subscription3 = autoIter.run(source, subject, 250);
// @ts-ignore
const subscription4 = autoIter.run(source, q, 250);

source.push(77);

setTimeout(function() {
   source.push(99);
}, 2500);

setTimeout(function() {
   // subscription1.unsubscribe();
   // subscription2.unsubscribe();
   // subscription3.unsubscribe();
   // subscription4.unsubscribe();
   console.log('no more', source.splice(4, 0));
}, 2800);

setTimeout(function() {
   // subscription1.unsubscribe();
   // subscription2.unsubscribe();
   // subscription3.unsubscribe();
   // subscription4.unsubscribe();
   console.log('no more', source.splice(3, 3));
}, 3200);

co(function* () {
   while(true) {
      console.log(yield ch);
   }
});

subject.subscribe( function( value: number) {
   console.log(value);
});

co(function* () {
   while(true) {
      console.log(yield q.next());
   }
});