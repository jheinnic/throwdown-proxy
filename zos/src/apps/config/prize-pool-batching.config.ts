import {IsInt, IsPositive} from 'class-validator';
import {configClass, configProp} from '../../infrastructure/config/decorator/index';
import '../../infrastructure/reflection/index';

@configClass("eth.lotto.eventSpec.prizePool.batching")
export class PrizePoolBatching {
   @configProp("reseedAfter")
   @IsPositive()
   @IsInt()
   public readonly reseedAfter: number = 4000;
}