import {IsInt, IsPositive} from 'class-validator';
import {configClass, configProp} from '../../../config/decorator/index';
import '../../../reflection';

@configClass("eth.lotto.eventSetup.shufflePolicy")
export class ShufflePolicy {
   @configProp("sweepCount")
   @IsPositive()
   @IsInt()
   public readonly sweepCount: number = 4;

   @configProp("sequenceWidth")
   @IsPositive()
   @IsInt()
   public readonly sequenceWidth: number = 0;

   @configProp("wordBits")
   @IsPositive()
   @IsInt()
   public readonly wordBits: number = 0;

   @configProp("entropyBits")
   @IsPositive()
   @IsInt()
   public readonly entropyBits: number = 0;

   @configProp("reseedEvery")
   @IsPositive()
   @IsInt()
   public readonly reseedEvery: number = 0;

}