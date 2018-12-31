import {configClass, configProp} from '@jchptf/di-app-registry';
import {Matches, ValidateNested} from 'class-validator';
import {RandomArtPlayAssets} from '../../modules/tickets/config';
import {PROTO_APP_TYPES} from '../di';
import {Type} from 'class-transformer';

@configClass('info.jchein.randomArt.experiment', PROTO_APP_TYPES.ProtoExperimentConfig)
export class ProtoExperiment
{
   @configProp('publicKeyFile')
   @Matches(/^\/?([^/\0]+\/)*[^/\0]+$/)
   public readonly publicKeyFile: string = '';

   // @configProp('variants')
   // @ValidateNested()
   // @IsArray()
   // @ArrayNotEmpty()
   // @Type(() => ModelSeedPolicy)
   // variants: ReadonlyArray<ModelSeedPolicy> = [];
   @configProp('assetPolicies')
   @ValidateNested()
   // @IsDefined()
   @Type(() => RandomArtPlayAssets)
   public readonly assetPolicies: RandomArtPlayAssets = new RandomArtPlayAssets();
}