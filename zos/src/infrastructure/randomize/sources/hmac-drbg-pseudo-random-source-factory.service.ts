import {HmacDrbgSeed} from './hmac-drbg-seed.interface';
import {IReseedingPseudoRandomSourceFactory} from '../interface/reseeding-pseudo-random-source-factory.interface';
import {IReseedingPseudoRandomSource} from '../interface/reseeding-pseudo-random-source.interface';
import {HmacDrbgPseudoRandomSource} from './hmac-drbg-pseudo-random-source.class';

export class HmacDrbgPseudoRandomSourceFactory implements IReseedingPseudoRandomSourceFactory<HmacDrbgSeed> {
   public seedGenerator(seedSource: HmacDrbgSeed): IReseedingPseudoRandomSource<undefined>
   {
      return new HmacDrbgPseudoRandomSource(seedSource);
   }

}