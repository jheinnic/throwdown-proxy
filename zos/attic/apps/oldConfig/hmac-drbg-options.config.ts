import {IsOptional, Min} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass('eth.lotto.deployment.entropy.hmacDrbg')
export class HmacDrbgOptions
{
   @configProp('entropyBitCount')
   @Min(32)
   entropyBitCount: number = 0;

   @configProp('nonceBitCount')
   @IsOptional()
   @Min(0)
   nonceBitCount: number = 0;

   @configProp('additionalEntropyWordCount')
   @IsOptional()
   @Min(0)
   additionalEntropyWordCount: number = 0;

   @configProp('additionalEntropyWordBits')
   @IsOptional()
   @Min(0)
   additionalEntropyWordBits: number = 0;
}