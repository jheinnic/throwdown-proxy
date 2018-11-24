import {Transform} from "stream";
import {Transducer} from 'transducers-js';

export interface IRewritePlanBuilder
{
   swap(indexOne: number, indexTwo: number, ...morePairs: [number, number]): IRewritePlanBuilder;

   move(indexOne: number, indexTwo: number, ...morePairs: [number, number]): IRewritePlanBuilder;

   copy(fromIndex: number, toIndex: number, ...morePairs: [number, number]): IRewritePlanBuilder;

   nCopy(fromIndex: number, ...toIndices: [number]): IRewritePlanBuilder;

   drop(index: number, ...moreIndices: [number]): IRewritePlanBuilder;

   stage(index: number, dataProvider: (index: number) => Buffer): IRewritePlanBuilder;

   transform(tx: Transducer, ...indices: [number]): IRewritePlanBuilder;

   rotate(readFirstWriteLast: number, ...writeNext: [number]): IRewritePlanBuilder
}
