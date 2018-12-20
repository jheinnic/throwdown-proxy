import {HmacDrbgSeed} from './hmac-drbg-seed.interface';
import {IPseudoRandomSeedFactory, IPseudoRandomSource, IRandomSource} from '../interface';
import {HmacDrbgPseudoRandomSource} from './hmac-drbg-pseudo-random-source.class';

export class HmacDrbgPseudoRandomSourceFactory implements IPseudoRandomSeedFactory {
   public seedGenerator(seedSource: HmacDrbgSeed): IPseudoRandomSource
   {
   }

   public seedNextSource(): Promise<IPseudoRandomSource>
   {
      return new HmacDrbgPseudoRandomSource(seedSource);
   }

}