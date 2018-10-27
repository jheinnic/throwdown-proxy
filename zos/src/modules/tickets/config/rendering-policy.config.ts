import {MaxLength, MinLength} from 'class-validator';

import '@jchptf/reflection';
import {configClass, configProp} from '@jchptf/config';

@configClass()
export class RenderingPolicy
{
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: string = '';

   @configProp('imageFieldPolicy')
   @MinLength(3)
   @MaxLength(128)
   public readonly imageFieldPolicyName: string = '';

   @configProp('modelSeedPolicy')
   @MinLength(3)
   @MaxLength(128)
   public readonly modelSeedPolicyName: string = '';
}
