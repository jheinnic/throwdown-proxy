import {IsHexadecimal, IsOptional, MaxLength, MinLength} from 'class-validator';

import {configClass, configProp} from '@jchptf/di-app-registry';
import {IsDevelopmentOnly} from '../../infrastructure/validation';
import '@jchptf/reflection';

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