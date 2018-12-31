import {AutoIterate} from '../infrastructure/lib';
import {asyncScheduler, Subject} from 'rxjs';
import chan = require('chan');
import {co} from 'co';
import Queue from 'co-priority-queue';
import {ConcurrentWorkFactory} from '@jchptf/coroutines';

const workFactory = new ConcurrentWorkFactory();
const autoIter = new AutoIterate(asyncScheduler, workFactory);

const source = [1, 2, 3, 4, 5];

function director(arg: number): void {
   console.log(arg);
}

const ch: Chan.Chan<number> = chan();

const subject: Subject<number> = new Subject<number>();

const q: Queue<number> = new Queue<number>();

// @ts-ignore
// const subscription1 = autoIter.run(source, director, 250);
// @ts-ignore
// const subscription2 = autoIter.run(source, ch, 250);
// @ts-ignore
// const subscription3 = autoIter.run(source, subject, 250);
// @ts-ignore
const subscription4 = autoIter.run(source, q, 250);

source.push(66);

setTimeout(function() {
   source.push(77);
}, 2500);

setTimeout(function() {
   q.push(88, 0);
}, 3500);

setTimeout(function() {
   source.push(99);
}, 4500);

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