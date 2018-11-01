import {IsPositive} from 'class-validator';

import {configClass, configProp} from '@jchptf/di-app-registry';
import '@jchptf/reflection';

@configClass()
export class IsaacOptions
{
   @configProp('seedBits')
   @IsPositive()
   public readonly seedBits: number = 0;
}
