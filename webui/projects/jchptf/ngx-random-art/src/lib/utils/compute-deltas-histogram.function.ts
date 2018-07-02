import {count, take, first, groupBy, flatMap, last, map, scan, skip} from 'rxjs/operators';
import {GroupedObservable, Observable, merge, zip} from 'rxjs/index';
import {bignumber, add, subtract, multiply, BigNumber} from 'mathjs';

interface ScanDeltas
{
  last: BigNumber;
  delta: BigNumber;
}

export interface HistogramBucket
{
  key: number;
  count: number;
}

export function computeDeltasHistogram(minValue: number, maxValue: number) // : (source: Observable<number>) => Observable<HistogramBucket>
{
  return (source: Observable<number>) => {
    const minNumber = bignumber(minValue);
    const maxNumber = bignumber(maxValue);

    source.pipe(take(10)).subscribe(console.log);

    return merge(
      zip(
        source.pipe(take(1)),
        source.pipe(last())
      )
        .pipe(
          map<[number, number], ScanDeltas>((endPoints: [number, number]) => {
            const firstValue = bignumber(endPoints[0]);
            const lastValue = bignumber(endPoints[1]);
            const minHalf = firstValue.minus(minNumber);
            const maxHalf = maxNumber.minus(lastValue);
            const endSum = minHalf.plus(maxHalf);

            console.log(`First and last points are ${firstValue.toString()} and ${lastValue.toString()}`);
            console.log(`Endpoint half-intervals are ${minHalf.toString()} and ${maxHalf.toString()}, adding to ${endSum.toString()}`);

            return {
              last: undefined,
              delta: endSum
            } as ScanDeltas;
          })
        ),
      source.pipe(
        map((value: number) => bignumber(value)),
        scan<BigNumber, ScanDeltas>(
          (acc: ScanDeltas, value: BigNumber) => {
            return {
              last: value,
              delta: value.minus(acc.last)
            };
          }, {
            last: minNumber,
            delta: undefined
          }),
        skip(1)
      )
    )
      .pipe(
        groupBy<ScanDeltas, number>((acc: ScanDeltas) => acc.delta.toNumber()),
        flatMap((groupObs: GroupedObservable<number, ScanDeltas>) => {
          const key: number = groupObs.key;

          return groupObs.pipe(
            count(),
            map<number, HistogramBucket>(
              (counter: number): HistogramBucket => {
                return {
                  key,
                  count: counter
                };
              }
            )
          );
        })
      );
  };
}


/*
interface ScanDeltas<N>
{
  last: N;
  delta: N;
}

export interface HistogramBucket<N>
{
  key: N;
  count: number;
}

export function computeDeltasHistogram(minValue: number, maxValue: number) // : (source: Observable<number>) => Observable<HistogramBucket>
{
  return (source: Observable<number>) => {
    const minNumber = bignumber(minValue);
    const maxNumber = bignumber(maxValue);

    return merge(
      zip(
        source.pipe(first()),
        source.pipe(last())
      )
        .pipe(
          map<[number, number], ScanDeltas<BigNumber>>((endPoints: [number, number]) => {
            const firstValue = bignumber(endPoints[0]);
            const lastValue = bignumber(endPoints[1]);
            const minHalf = firstValue.minus(minNumber);
            const maxHalf = maxNumber.minus(lastValue);
            const endSum = minHalf.plus(maxHalf);

            console.log(`First and last points are ${firstValue.toString()} and ${lastValue.toString()}`);
            console.log(`Endpoint half-intervals are ${minHalf.toString()} and ${maxHalf.toString()}, adding to ${endSum.toString()}`);

            return {
              last: undefined,
              delta: endSum
            } as ScanDeltas<BigNumber>;
          })
        ),
      source.pipe(
        map<number, BigNumber>((value: number) => bignumber(value)),
        scan<BigNumber, ScanDeltas<BigNumber>>(
          (acc: ScanDeltas<BigNumber>, value: BigNumber) => {
            return {
              last: value,
              delta: value.minus(acc.last)
            };
          }, {
            last: minNumber,
            delta: undefined
          }),
        skip(1)
      )
    )
      .pipe(
        groupBy<ScanDeltas<BigNumber>, BigNumber>((acc: ScanDeltas<BigNumber>) => acc.delta),
        flatMap((groupObs: GroupedObservable<BigNumber, ScanDeltas<BigNumber>>) => {
          const key: BigNumber = groupObs.key;

          return groupObs.pipe(
            count(),
            map<number, HistogramBucket<BigNumber>>(
              (counter: number): HistogramBucket<BigNumber> => {
                return {
                  key,
                  count: counter
                };
              }
            )
          );
        })
      );
  };
}
*/
