// import {AsyncIterableX} from 'ix/asynciterable';
import {IterableX} from 'ix/iterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/iterable/range';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
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
import {flatMapAsync} from 'ix/iterable/flatmapasync';
import 'ix/add/asynciterable/asyncify';

const masterSequence: Iterable<number> = IterableX.range(1, 5000)
   .publish()
   .take(10);

// IterableX.repeat(masterSequence as Iterable<number>, 10)
//    .flatMap((seq) => seq)
//    .forEach((value) => {
//       console.log(value);
//    });
//
// console.log('Umbrada brada brada');
//
// IterableX.repeat(masterSequence as Iterable<number>, 10)
//    .flatMap((seq) => seq)
//    .forEach((value) => {
//       console.log(value);
//    });

// AsyncIterableX.merge(
   flatMapAsync(
      IterableX.repeat(masterSequence as Iterable<number>, 20),
      (source) => source)
   // flatMapAsync(
   //    IterableX.repeat(masterSequence as Iterable<number>, 10),
   //    (source) => source)
// )
   .forEach((value) => {
      console.log(value);
   });
