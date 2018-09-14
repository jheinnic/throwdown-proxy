import {IsInt, IsPositive, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {HasUniquePrizeTierIds} from '../../../validation/has-unique-prize-ids.validator';
import {PrizeTier} from '../../../config/values/prize-tier.value';
import {configClass, configProp} from '../../../config/decorator/index';
import '../../../reflection/index';
import {PrizePoolBatching} from './prize-pool-batching.config';

@configClass("eth.lotto.eventSpec.prizePool") // "eth.lotto.eventSpec")
export class PrizePool {
   @configProp("batching")
   @ValidateNested()
   @Type(() => PrizePoolBatching)
   public readonly batching: PrizePoolBatching = new PrizePoolBatching();

   @configProp("secondChanceCount")
   @IsPositive()
   @IsInt()
   public readonly secondChanceCount: number = 0;

   @configProp("prizeTiers")
   @HasUniquePrizeTierIds()
   @ValidateNested()
   @Type(() => PrizeTier)
   public readonly prizeTiers: PrizeTier[] = [];
}
