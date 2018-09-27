import {IsOptional, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {IsDevelopmentOnly} from '../../infrastructure/validation';
import {configClass, configProp} from '../../infrastructure/config';
import {DevFakeOptions} from './dev-fake-options.config';
import '../../infrastructure/reflection';

@configClass("eth.lotto.deployment.entropy")
export class EntropyAlgorithmsConfig
{
   @configProp("devFakeKey")
   @IsOptional()
   @ValidateNested()
   @IsDevelopmentOnly()
   @Type(() => DevFakeOptions)
   devFakeKey: DevFakeOptions = new DevFakeOptions();
}