import {IsInt, IsPositive} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';
import '../../infrastructure/reflection';

@configClass('eth.lotto.eventSpec.prizePool.batching')
export class PrizePoolBatching {
   @configProp('reseedAfter')
   @IsPositive()
   @IsInt()
   public readonly reseedAfter: number = 4000;
}