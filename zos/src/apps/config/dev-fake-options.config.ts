import {IsHexadecimal, IsOptional, MaxLength, MinLength} from 'class-validator';

import {IsDevelopmentOnly} from '../../infrastructure/validation/is-development-only.validator';
import {configClass, configProp} from '../../infrastructure/config/decorator/index';
import '../../infrastructure/reflection/index';

@configClass("eth.lotto.deployment.entropy.devFake")
export class DevFakeOptions {
   @configProp("hexSeedBits")
   @IsOptional()
   @MinLength(16)
   @MaxLength(65536)
   @IsHexadecimal()
   @IsDevelopmentOnly()
   hexSeedBits: string = 'a1d4b3c2';
}