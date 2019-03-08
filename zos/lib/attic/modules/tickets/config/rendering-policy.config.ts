import {MaxLength, MinLength} from 'class-validator';

import '@jchptf/reflection';
import {configClass, configProp} from '@jchptf/di-app-registry';
import {Name} from '../../../../../src/infrastructure/validation/name.type';

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
