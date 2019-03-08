import { IPseudoRandomSourceFactory, IPseudoRandomSource } from '../interface';
import { IsaacPseudoRandomSource } from './isaac-pseudo-random-source.class';

export class IsaacPseudoRandomSourceFactory implements IPseudoRandomSourceFactory<Buffer>
{
   public seedGenerator(seedSource: Buffer): IPseudoRandomSource
   {
      return new IsaacPseudoRandomSource(seedSource)
   }

}