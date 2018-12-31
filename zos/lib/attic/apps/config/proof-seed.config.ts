import {IsInt, IsPositive} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass("eth.lotto.setupPolicy.proofSeed")
export class ProofSeed {
   @configProp("batchBits")
   @IsPositive()
   @IsInt()
   public readonly batchBits: number = 0;

   @configProp("generatedBits")
   @IsPositive()
   @IsInt()
   public readonly generatedBits: number = 0;

   @configProp("entryCount")
   @IsPositive()
   @IsInt()
   public readonly entryCount: number = 0;

   // TODO: IsUnique?
   @configProp("batchIds")
   @IsPositive()
   @IsInt()
   public readonly batchIds: number = 0;
}