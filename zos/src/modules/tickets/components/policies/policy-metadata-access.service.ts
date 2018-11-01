import {inject, injectable} from 'inversify';
import {IterableX} from 'ix/iterable';
import {
   BitStrategyKind, ImageStylePolicy, ModelSeedPolicy, RandomArtPlayAssets, RenderingPolicy
} from '../../config';
import {
   ImageStyleMetadata, ImageStyleName, IPaintModelSeedStrategy, IPolicyMetadataAccess,
   ModelSeedStrategyMetadata, ModelSeedStrategyName, RenderStyleMetadata, RenderStyleName
} from '../../interface';
import {
   Base64ToAsciiModelSeedStrategy, EightFromSevenModelSeedStrategy, Mod128ModelSeedStrategy,
   Mod160ModelSeedStrategy, RawModelSeedStrategy
} from '../modelSeed';
import {TICKET_POOL_TYPES} from '../../di';
import {illegalArgs} from '@thi.ng/errors';
import {UUID} from '../../../../infrastructure/validation';


@injectable()
export class PolicyMetadataAccess implements IPolicyMetadataAccess
{
   private readonly renderStyles: Map<RenderStyleName, RenderStyleMetadata>;

   private readonly imageStyles: Map<ImageStyleName, ImageStyleMetadata>;

   private readonly seedStrategies: Map<ModelSeedStrategyName, ModelSeedStrategyMetadata>;

   /**
    * @param randomArtPlayAssets
    */
   constructor(
      @inject(TICKET_POOL_TYPES.PolicyAssets)
      private readonly randomArtPlayAssets: RandomArtPlayAssets
   )
   {
      const renderingPolicies: IterableX<RenderingPolicy> =
         IterableX.from(this.randomArtPlayAssets.renderPolicies)

      const imagePolicies: IterableX<ImageStyleMetadata> =
         IterableX.from(this.randomArtPlayAssets.imagePolicies)
            .groupJoin(
               renderingPolicies,
               (imagePolicy: ImageStylePolicy) => { return imagePolicy.name },
               (renderPolicy: RenderingPolicy) => { return renderPolicy.imageStylePolicyName },
               (
                  imagePolicy: ImageStylePolicy,
                  renderPolicies: Iterable<RenderingPolicy>): ImageStyleMetadata => {
                  const {name, fitOrFill, unitScale, previewPixel} = imagePolicy;
                  const renderStyles: ReadonlyArray<RenderStyleName> =
                     IterableX.from(renderPolicies)
                        .map(value => value.name as RenderStyleName)
                        .toArray();
                  return {
                     name,
                     previewPixel,
                     renderStyles,
                     fullSize: {
                        ...imagePolicy.fullSize,
                        fitOrFill,
                        unitScale
                     },
                     thumbnail: {
                        ...imagePolicy.fullSize,
                        fitOrFill,
                        unitScale
                     },
                  } as ImageStyleMetadata;
               }
            );

      const seedModelPolicies: IterableX<ModelSeedStrategyMetadata> =
         IterableX.from(this.randomArtPlayAssets.seedPolicies)
            .groupJoin(
               renderingPolicies,
               (seedPolicy: ModelSeedPolicy) => { return seedPolicy.name; },
               (renderPolicy: RenderingPolicy) => { return renderPolicy.modelSeedPolicyName; },
               (seedPolicy: ModelSeedPolicy, renderPolicies: Iterable<RenderingPolicy>) => {
                  const {name} = seedPolicy;
                  const modelSeedStrategy: IPaintModelSeedStrategy =
                     PolicyMetadataAccess.policyToStrategy(seedPolicy);
                  const renderStyles: ReadonlyArray<RenderStyleName> =
                     IterableX.from(renderPolicies)
                        .map(value => value.name as RenderStyleName)
                        .toArray();
                  return {
                     name: name as ModelSeedStrategyName,
                     renderStyles,
                     modelSeedStrategy
                  } as ModelSeedStrategyMetadata
               }
            );

      const renderingStyles: IterableX<RenderStyleMetadata> =
         renderingPolicies.innerJoin(
            imagePolicies,
            (renderPolicy) => {return renderPolicy.imageStylePolicyName;},
            (imageStyle) => {return imageStyle.name;},
            (
               renderPolicy: RenderingPolicy,
               imageStyle: ImageStyleMetadata): [RenderingPolicy, ImageStyleMetadata] => {
               return [renderPolicy, imageStyle];
            }
         )
            .innerJoin(
               seedModelPolicies,
               (value: [RenderingPolicy, ImageStyleMetadata]) => value[0].modelSeedPolicyName,
               (value: ModelSeedStrategyMetadata) => value.name,
               (
                  pair: [RenderingPolicy, ImageStyleMetadata],
                  seedMeta: ModelSeedStrategyMetadata): RenderStyleMetadata => {
                  return {
                     name: pair[0].name,
                     imageStyle: pair[1],
                     seedStrategy: seedMeta
                  } as RenderStyleMetadata;
               }
            );

      this.imageStyles =
         imagePolicies.toMap(
            (value) => value.name,
            (value) => value
         );
      this.seedStrategies =
         seedModelPolicies.toMap(
            (value) => value.name,
            (value) => value
         );
      this.renderStyles =
         renderingStyles.toMap(
            (value) => value.name,
            (value) => value
         );
   }

   findSeedStrategyByName(name: ModelSeedStrategyName): ModelSeedStrategyMetadata
   {
      const retVal = this.seedStrategies.get(name);
      if (! retVal) {
         illegalArgs(`No model seed strategy named ${name} found`);
      }

      return retVal!;
   }

   findImageStyleByName(name: ImageStyleName): ImageStyleMetadata
   {
      const retVal = this.imageStyles.get(name);
      if (! retVal) {
         illegalArgs(`No image style named ${name} found`);
      }

      return retVal!;
   }

   findRenderStyleByName(name: RenderStyleName): RenderStyleMetadata
   {
      const retVal = this.renderStyles.get(name);
      if (! retVal) {
         illegalArgs(`No render style named ${name} found`);
      }

      return retVal!;
   }

   * findRenderStylesByName(names: Iterable<RenderStyleName>): Iterable<RenderStyleMetadata>
   {
      for (let name of names) {
         const retVal = this.renderStyles.get(name);
         if (! retVal) {
            illegalArgs(`No render style named ${name} found`);
         }

         yield retVal!;
      }
   }

   findRenderStylesByImageStyleName(name: ImageStyleName): Iterable<RenderStyleMetadata>
   {
      const imageStyle = this.imageStyles.get(name);
      if (! imageStyle) {
         illegalArgs(`No image style named ${name} found`);
      }

      return this.findRenderStylesByName(imageStyle!.renderStyles);
   }

   // if (!imagePolicyName) {
   //    imagePolicyName = renderPolicy.imageStylePolicyName;
   // }
   //
   // if (imagePolicyName !== renderPolicy.imageStylePolicyName) {
   //    throw illegalArgs(
   //       `All selected renders must share the same image policy, but ${imagePolicyName} !=
   // ${renderPolicy.imageStylePolicyName}` ); }

   static policyToStrategy(modelSeedPolicy: ModelSeedPolicy): IPaintModelSeedStrategy
   {
      let nextStrategy: IPaintModelSeedStrategy;

      switch (modelSeedPolicy.bitMode) {
         case BitStrategyKind.base64ToAscii:
         {
            nextStrategy = new Base64ToAsciiModelSeedStrategy(modelSeedPolicy);
            break;
         }
         case BitStrategyKind.get8From7:
         {
            nextStrategy = new EightFromSevenModelSeedStrategy(modelSeedPolicy);
            break;
         }
         case BitStrategyKind.mod128:
         {
            nextStrategy = new Mod128ModelSeedStrategy(modelSeedPolicy);
            break;
         }
         case BitStrategyKind.mod160:
         {
            nextStrategy = new Mod160ModelSeedStrategy(modelSeedPolicy);
            break;
         }
         case BitStrategyKind.raw:
         {
            nextStrategy = new RawModelSeedStrategy(modelSeedPolicy);
            break;
         }
         default:
         {
            throw new Error('Unrecognized BitStrategyKind: ' + modelSeedPolicy.bitMode);
         }
      }

      return nextStrategy;
   }

   public getConfigVersion(): UUID
   {
      return this.randomArtPlayAssets.configVersion;
   }
}
