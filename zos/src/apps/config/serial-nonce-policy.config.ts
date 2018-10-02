import {IsInt, IsPositive} from 'class-validator';

import {configClass, configProp} from '../../infrastructure/config';
import '../../infrastructure/reflection';

@configClass("eth.lotto.setupPolicy.serialNoncePolicy") // "eth.lotto.eventSpec")
export class SerialNoncePolicy {
   @configProp("entropyBits")
   @IsInt()
   @IsPositive()
   public readonly entropyBits: number = 0;

   @configProp("reseedEvery")
   @IsInt()
   @IsPositive()
   public readonly reseedEvery: number = 0;
}