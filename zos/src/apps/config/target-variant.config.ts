import {MaxLength, Min, MinLength} from 'class-validator';

import {configClass, configProp} from '../../infrastructure/config';
import '../../infrastructure/reflection';

@configClass()
export class TargetVariant
{
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: string = '';

   @configProp('generation')
   @Min(1)
   public readonly generation: number = 0;
}
