import {MaxLength, MinLength} from 'class-validator';

import '@jchptf/reflection';
import {Name} from '../../../infrastructure/validation';
import { configClass, configProp } from '@jchptf/config';

@configClass()
export class RenderingPolicy
{
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: Name = '' as Name;

   @configProp('imageFieldPolicy')
   @MinLength(3)
   @MaxLength(128)
   public readonly imageStylePolicyName: Name = '' as Name;

   @configProp('modelSeedPolicy')
   @MinLength(3)
   @MaxLength(128)
   public readonly modelSeedPolicyName: Name = '' as Name;
}
