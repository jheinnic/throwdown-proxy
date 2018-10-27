import {IMerkleCalculator} from '../../infrastructure/merkle/index';
import {Chan} from 'medium';
import {IterableX as Iterable} from 'ix/iterable';

interface CanonicalTask
{
}

export class TaskAdapterSource
{
   constructor(
      merkleCalculator: IMerkleCalculator,
      toTaskPool: Chan<CanonicalTask>
   )
   {
      this.srcIter = Iterable.from(
         merkleCalculator.getTopoDigestOrder((builder) => {
            builder.leftToRight(true)
               .breadthFirst(false);
         })).pipe(

      );
   }
}

