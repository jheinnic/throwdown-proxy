import {IsInt, IsPositive} from 'class-validator';
import {configClass, configProp} from '../../infrastructure/config/decorator/index';
import '../../infrastructure/reflection/index';

@configClass("eth.lotto.setupPolicy.tierNoncePolicy") // "eth.lotto.eventSpec")
export class TierNoncePolicy {
   @configProp("entropyBits")
   @IsInt()
   @IsPositive()
   public readonly entropyBits: number = 0;

   @configProp("reseedEvery")
   @IsInt()
   @IsPositive()
   public readonly reseedEvery: number = 0;
}