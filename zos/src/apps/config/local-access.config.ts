import {IsOptional} from 'class-validator';

import {configClass, configProp} from '../../infrastructure/config';
import {IsDevelopmentOnly} from '../../infrastructure/validation/is-development-only.validator';
import '../../infrastructure/reflection';

@configClass("eth.lotto.deployment.localAccess")
export class LocalAccess {
   @configProp("rootPath")
   @IsOptional()
   @IsDevelopmentOnly()
   rootPath: string = '';
}