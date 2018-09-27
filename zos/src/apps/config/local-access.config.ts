import {IsOptional} from 'class-validator';

import {IsDevelopmentOnly} from '../../infrastructure/validation/is-development-only.validator';
import {configClass, configProp} from '../../infrastructure/config/decorator/index';
import '../../infrastructure/reflection/index';

@configClass("eth.lotto.deployment.localAccess")
export class LocalAccess {
   @configProp("rootPath")
   @IsOptional()
   @IsDevelopmentOnly()
   rootPath: string = '';
}