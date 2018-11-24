import {AsyncIterableX} from 'ix/asynciterable';
// import {IterableX} from 'ix/iterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/iterable/range';
import 'ix/add/asynciterable/range';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/memoize';
import 'ix/add/asynciterable-operators/takeuntil';
import 'ix/add/asynciterable-operators/take';
import 'ix/add/asynciterable-operators/repeat';
import 'ix/add/asynciterable-operators/flatmap';
import 'ix/add/asynciterable-operators/mergeall';
import 'ix/add/asynciterable-operators/share';
import 'ix/add/iterable-operators/publish';
import 'ix/add/iterable-operators/share';
import 'ix/add/iterable-operators/take';
import 'ix/add/iterable/repeat';
import 'ix/add/iterable-operators/flatten';
import 'ix/add/iterable-operators/flatmap';
import 'ix/add/asynciterable/asyncify';
import {AsyncSink} from 'ix';
import {go, sleep} from 'medium';
import {asyncScheduler, SchedulerAction} from 'rxjs';

const asyncSink: AsyncSink<string> =
   new AsyncSink<string>();

for await (const foo of asyncSink) {
   console.log(foo);
}
