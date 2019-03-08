import {Type} from 'class-transformer';
import {IsUUID, ValidateNested} from 'class-validator';

import '@jchptf/reflection';
import {configClass, configProp} from '@jchptf/di-app-registry';
import {ArrayKeysAreUnique, UUID} from '../../../../../src/infrastructure/validation';
import {ImageStylePolicy, ModelSeedPolicy, RenderingPolicy} from '.';

@configClass('eth.lotto.playAssets.randomArt')
export class RandomArtPlayAssets
{
   @configProp('configVersion')
   @IsUUID()
   public readonly configVersion: UUID = '' as UUID;

   @configProp('imagePolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: ImageStylePolicy) => policy.name)
   public readonly imagePolicies: ReadonlyArray<ImageStylePolicy> = [];

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
