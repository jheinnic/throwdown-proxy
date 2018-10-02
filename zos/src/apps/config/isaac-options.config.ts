import {IsPositive} from 'class-validator';

import {configClass, configProp} from '../../infrastructure/config';
import '../../infrastructure/reflection';

@configClass()
export class IsaacOptions
{
   @configProp('seedBits')
   @IsPositive()
   public readonly seedBits: number = 0;
}
