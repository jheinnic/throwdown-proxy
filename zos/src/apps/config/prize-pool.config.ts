import {ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {configClass, configProp} from '@jchptf/config';
import {HasUniquePrizeTierIds} from '../../infrastructure/validation/has-unique-prize-ids.validator';
import {PrizePoolBatching} from './prize-pool-batching.config';
import {PrizeTier} from './prize-tier.config';


@configClass('eth.lotto.eventSpec.prizePool') // 'eth.lotto.eventSpec')
export class PrizePool {
   @configProp('batching')
   @ValidateNested()
   @Type(() => PrizePoolBatching)
   public readonly batching: PrizePoolBatching = new PrizePoolBatching();

   // @configProp('secondChanceCount')
   // @IsPositive()
   // @IsInt()
   // public readonly secondChanceCount: number = 0;

   @configProp('prizeTiers')
   @HasUniquePrizeTierIds()
   @ValidateNested({each: true})
   @Type(() => PrizeTier)
   public readonly prizeTiers: PrizeTier[] = [];
}
