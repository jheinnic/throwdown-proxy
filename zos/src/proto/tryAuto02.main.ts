// @ts-ignore
import {asapScheduler, asyncScheduler, Subject} from 'rxjs';
import chan = require('chan');
import {co} from 'co';
import Queue from 'co-priority-queue';

import {ConcurrentWorkFactory} from '@jchptf/coroutines';
import {AutoIterate} from '../infrastructure/lib';
import {asGenerator} from '../infrastructure/lib/interfaces/sink-like.type';

const workFactory = new ConcurrentWorkFactory();
const autoIter = new AutoIterate(asyncScheduler, workFactory);

const source = [1, 2, 3, 4, 5];
const source2 = [9, 8, 7, 6, 5];
const source3 = [-1, -2, -3, -4, -5];
// const master = [source, source2, source];

const master = workFactory.createPriorityQueue<Iterable<number>>()
const sendInput = asGenerator(master);
sendInput(source).next();
sendInput(source2).next();
sendInput(source3).next();

// @ts-ignore
function director(arg: number): void {
   console.log(arg);
}

const ch: Chan.Chan<number> = chan();

const subject: Subject<number> = new Subject<number>();

const q: Queue<number> = workFactory.createPriorityQueue<number>()

// @ts-ignore
// const subscription1 = autoIter.twine(master, director, 100);
// @ts-ignore
// const subscription2 = autoIter.twine(master, ch, 250);
// @ts-ignore
const subscription3 = autoIter.unwind(master, subject, 120);
// @ts-ignore
// const subscription4 = autoIter.twine(master, q, 250);

// source.push(77);

/*
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
*/

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

setTimeout(function() {
   sendInput([99, 88, 77, 66, 55, 44, 33, 22, 11, 10]).next();
   sendInput([100, 200, 300]).next();
}, 500);
setTimeout(function() {
   sendInput([400, 500, 0, 600]).next();
   sendInput([-5, -55]).next();
}, 1200);

setTimeout(function() {
   sendInput([90, 80, 70, 60, 50, 40, 30, 20, -20, -50]).next();
}, 10000);
