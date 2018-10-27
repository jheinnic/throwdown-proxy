import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';

import {configClass, configProp} from '../../../infrastructure/config';
import {ArrayKeysAreUnique} from '../../../infrastructure/validation';
import {ImageFieldPolicy, ModelSeedPolicy, RenderingPolicy} from '.';
import '../../../infrastructure/reflection';

@configClass('eth.lotto.playAssets.randomArt')
export class RandomArtPlayAssets
{
   @configProp('imagePolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: ImageFieldPolicy) => policy.name)
   public readonly imagePolicies: ReadonlyArray<ImageFieldPolicy> = [];

   @configProp('seedPolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: ModelSeedPolicy) => policy.name)
   @Type(() => ModelSeedPolicy)
   public readonly seedPolicies: ReadonlyArray<ModelSeedPolicy> = [];

   @configProp('renderPolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: RenderingPolicy) => policy.name)
   @Type(() => RenderingPolicy)
   public readonly renderPolicies: ReadonlyArray<RenderingPolicy> = [];
}
