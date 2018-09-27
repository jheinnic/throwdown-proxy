import {IsOptional, Min} from 'class-validator';
import {configClass, configProp} from '../../infrastructure/config';
import '../../infrastructure/reflection';

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

   @configProp('additionalEntropyWords')
   @IsOptional()
   @Min(0)
   additionalEntropyWords: number = 0;
}