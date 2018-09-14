import {IsInt, IsPositive} from 'class-validator';
import {configClass, configProp} from '../../../config/decorator/index';
import '../../../reflection';

@configClass("eth.lotto.eventSpec.prizePool.batching")
export class PrizePoolBatching {
   @configProp("reseedAfter")
   @IsPositive()
   @IsInt()
   public readonly reseedAfter: number = 4000;
}