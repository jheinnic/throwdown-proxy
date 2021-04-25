import {IterableX} from 'ix/iterable';

class StepRangeIterable extends IterableX<[number, number]> {
   private _start: number;
   private _count: number;
   private _step: number;

   constructor(start: number, count: number, step: number) {
      super();
      this._start = start;
      this._count = count;
      this._step = step;
   }

   *[Symbol.iterator]() {
      for (let current = this._start, index = this._start, end = this._start + (this._count * this._step); current < end; current += this._step, index++) {
         yield [current, index] as [number, number];
      }
   }
}

export function stepRange(start: number, count: number, step: number): IterableX<[number, number]> {
   return new StepRangeIterable(start, count, step);
}