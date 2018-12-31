import {IsInt, IsPositive} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


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