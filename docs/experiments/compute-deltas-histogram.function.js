"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var index_1 = require("rxjs/index");
var mathjs_1 = require("mathjs");
function computeDeltasHistogram(minValue, maxValue) {
    return function (source) {
        var minNumber = mathjs_1.bignumber(minValue);
        var maxNumber = mathjs_1.bignumber(maxValue);
        source.pipe(operators_1.take(10)).subscribe(console.log);
        return index_1.merge(index_1.zip(source.pipe(operators_1.take(1)), source.pipe(operators_1.last()))
            .pipe(operators_1.map(function (endPoints) {
            var firstValue = mathjs_1.bignumber(endPoints[0]);
            var lastValue = mathjs_1.bignumber(endPoints[1]);
            var minHalf = firstValue.minus(minNumber);
            var maxHalf = maxNumber.minus(lastValue);
            var endSum = minHalf.plus(maxHalf);
            console.log("First and last points are " + firstValue.toString() + " and " + lastValue.toString());
            console.log("Endpoint half-intervals are " + minHalf.toString() + " and " + maxHalf.toString() + ", adding to " + endSum.toString());
            return {
                last: undefined,
                delta: endSum
            };
        })), source.pipe(operators_1.map(function (value) { return mathjs_1.bignumber(value); }), operators_1.scan(function (acc, value) {
            return {
                last: value,
                delta: value.minus(acc.last)
            };
        }, {
            last: minNumber,
            delta: undefined
        }), operators_1.skip(1)))
            .pipe(operators_1.groupBy(function (acc) { return acc.delta.toNumber(); }), operators_1.flatMap(function (groupObs) {
            var key = groupObs.key;
            return groupObs.pipe(operators_1.count(), operators_1.map(function (counter) {
                return {
                    key: key,
                    count: counter
                };
            }));
        }));
    };
}
exports.computeDeltasHistogram = computeDeltasHistogram;
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
//# sourceMappingURL=compute-deltas-histogram.function.js.map