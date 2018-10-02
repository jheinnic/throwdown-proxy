import {MaxLength, Min, MinLength} from 'class-validator';

import {configClass, configProp} from '../../../../infrastructure/config/index';
import '../../../../infrastructure/reflection/index';

@configClass()
export class RenderingPolicyVersion
{
   @configProp('generation')
   @Min(1)
   public readonly generation: number = 0;

   @configProp('imageFieldPolicy')
   @MinLength(3)
   @MaxLength(128)
   public readonly imageFieldPolicyName: string = '';

   @configProp('modelSeedPolicy')
   @MinLength(3)
   @MaxLength(128)
   public readonly modelSeedPolicyName: string = '';
}
