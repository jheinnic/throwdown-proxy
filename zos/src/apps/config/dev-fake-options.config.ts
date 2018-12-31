import {IsHexadecimal, IsOptional, MaxLength, MinLength} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';
import {IsDevelopmentOnly} from '../../infrastructure/validation';


@configClass('eth.lotto.deployment.entropy.devFake')
export class DevFakeOptions {
   @configProp('hexSeedBits')
   @IsOptional()
   @MinLength(16)
   @MaxLength(65536)
   @IsHexadecimal()
   @IsDevelopmentOnly()
   hexSeedBits: string = 'a1d4b3c2';
}