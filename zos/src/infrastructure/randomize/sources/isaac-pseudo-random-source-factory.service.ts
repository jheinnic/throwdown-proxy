import {IPseudoRandomSourceFactory} from '../interface/pseudo-random-seed-factory.interface';
import {IPseudoRandomSource} from '../interface/pseudo-random-source.interface';
import {IsaacPseudoRandomSource} from './isaac-pseudo-random-source.class';

export class IsaacPseudoRandomSourceFactory implements IPseudoRandomSourceFactory<Buffer>
{
   public seedGenerator(seedSource: Buffer): IPseudoRandomSource
   {
      return new IsaacPseudoRandomSource(seedSource)
   }

}