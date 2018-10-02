import {Type} from 'class-transformer';
import {Allow, ValidateNested} from 'class-validator';

import {configClass, configProp} from '../../../../infrastructure/config/index';
import {ArrayKeysAreUnique} from '../../../../infrastructure/validation/array-keys-are-unique.validator';
import {ModelSeedPolicy} from './model-seed-policy.config';
import {ImageFieldPolicy} from './image-field-policy.config';
import {RenderingPolicy} from './rendering-policy.config';
import {TargetVariant} from '../../../../apps/config/target-variant.config';
import '../../../../infrastructure/reflection/index';

@configClass('eth.lotto.playAssets.randomArt')
export class RandomArtPlayAssets {
   @configProp('imagePolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: ImageFieldPolicy) => policy.name )
   public readonly imagePolicies: ReadonlyArray<ImageFieldPolicy> = [];

   @configProp('seedPolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: ModelSeedPolicy) => policy.name )
   @Type(() => ModelSeedPolicy)
   public readonly seedPolicies: ReadonlyArray<ModelSeedPolicy> = [];

   @configProp('renderingPolicies')
   @ValidateNested()
   @ArrayKeysAreUnique((policy: RenderingPolicy) => policy.name )
   @Type(() => RenderingPolicy)
   public readonly renderPolicies: ReadonlyArray<RenderingPolicy> = [];

   // TODO: Add constraint that can check the named variant exists in namedVariants
   // TODO: Consider how to allow multiple variants to be active.  Probably will require inputs
   //    from source labelling which variant pipeline they belong to, and a painter pool abstraction
   //    that each have a fixed number of canvases and can accept inputs from one or more variants.
   @configProp('painting')
   @ValidateNested()
   @Allow()
   public readonly painting: TargetVariant = new TargetVariant;
}