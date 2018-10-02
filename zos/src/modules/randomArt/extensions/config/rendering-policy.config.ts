import {MaxLength, MinLength, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {configClass, configProp} from '../../../../infrastructure/config/index';
import {RenderingPolicyVersion} from './rendering-policy-version.config';
import '../../../../infrastructure/reflection/index';

@configClass()
export class RenderingPolicy
{
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: string = '';

   @configProp('versions')
   @ValidateNested()
   // TODO
   // @ArrayKeysAreIndexed((version RenderingPolicyVersion) => (version.generation - 1) )
   @Type(() => RenderingPolicyVersion)
   public readonly versions: ReadonlyArray<RenderingPolicyVersion> = [];
}
