import {IsIn, IsInt, IsPositive} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass("eth.lotto.eventSetup.shufflePolicy")
export class ShufflePolicy {
   @configProp("passCount")
   @IsPositive()
   @IsInt()
   public readonly passCount: number = 4;

   @configProp("concurrentRuns")
   @IsPositive()
   @IsInt()
   public readonly concurrentRuns: number = 0;

   @configProp("bitsPerDraw")
   @IsPositive()
   @IsInt()
   public readonly bitsPerDraw: number = 0;

   @configProp("entropySeedBits")
   @IsPositive()
   @IsInt()
   public readonly entropySeedBits: number = 0;

   @configProp("algorithmKey")
   @IsIn(["isaac", "hmac-drbg", "fortuna", "yarrow", "twister", "random.org"])
   public readonly algorithmKey: string = '';

}