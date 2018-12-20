import {IterableX} from 'ix/iterable';
import {expand} from 'ix/iterable/pipe/expand';
import {distinctUntilChanged} from 'ix/iterable/pipe/distinctUntilChanged';
import {scan} from 'ix/iterable/pipe/scan';

const source = IterableX.of(
   {tag: 'a', count: 1},
   {tag: 'b', count: 3},
   {tag: 'c', count: 7},
   {tag: 'd', count: 3},
);

source.pipe(
   expand((value: {tag: string, count: number}) => {
      const count = value.count - 1;
      if (count > 0) {
         return IterableX.of(value, {tag: value.tag, count});
      }

      return IterableX.of();
   }),
   scan((acc, value) => {
      if (! acc) {
         // console.log('acc undef', value);
         return value;
      }

      if (acc.tag === value.tag) {
         if (value.count < acc.count) {
            // console.log('value.tag < acc.tag; tag = ' + acc.tag, acc, value, value);
            return value;
         }
      } else {
         // console.log('value.tag != acc.tag', acc, value, value);
         return value;
      }

      // console.log('value.tag >= acc.tag; tag = ' + acc.tag, acc, value, acc);
      return acc;
   }, undefined),
   distinctUntilChanged()
).forEach((value, index) => {
   console.log(index, value)
});