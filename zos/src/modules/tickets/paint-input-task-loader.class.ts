import {ITicketPoolAssembly} from './interface';
import {BitStrategyKind, ImageFieldPolicy, ModelSeedPolicy, RandomArtPlayAssets} from './config';

import {IMerkleCalculator} from '../../infrastructure/merkle';
import {IPaintModelSeedStrategy} from './interface/paint-model-seed-strategy.interface';
import {Base64ToAsciiModelSeedStrategyClass} from './base64-to-ascii-model-seed-strategy.class';
import {EightFromSevenModelSeedStrategyClass} from './eight-from-seven-model-seed-strategy.class';
import {Mod128ModelSeedStrategyClass} from './mod-128-model-seed-strategy.class';
import {Mod160ModelSeedStrategyClass} from './mod-160-model-seed-strategy.class';
import {RawModelSeedStrategyClass} from './raw-model-seed-strategy.class';
import {CanvasDimensions} from '../randomArt/messages';

export class PaintInputTaskLoader
{
   private readonly seedStrategyMap: Map<string, IPaintModelSeedStrategy>;

   constructor(
      private readonly merkleCalculator: IMerkleCalculator,
      private readonly ticketPoolAssembly: ITicketPoolAssembly,
      private readonly randomArtPlayAssets: RandomArtPlayAssets
   )
   {
      this.seedStrategyMap = new Map<string, IPaintModelSeedStrategy>();

      let modelSeedPolicy: ModelSeedPolicy;
      for (modelSeedPolicy of this.randomArtPlayAssets.seedPolicies) {
         let nextStrategy: IPaintModelSeedStrategy;

         switch (modelSeedPolicy.bitMode) {
            case BitStrategyKind.base64ToAscii: {
               nextStrategy = new Base64ToAsciiModelSeedStrategyClass(modelSeedPolicy);
               break;
            }
            case BitStrategyKind.get8From7: {
               nextStrategy = new EightFromSevenModelSeedStrategyClass(modelSeedPolicy);
               break;
            }
            case BitStrategyKind.mod128: {
               nextStrategy = new Mod128ModelSeedStrategyClass(modelSeedPolicy);
               break;
            }
            case BitStrategyKind.mod160: {
               nextStrategy = new Mod160ModelSeedStrategyClass(modelSeedPolicy);
               break;
            }
            case BitStrategyKind.raw: {
               nextStrategy = new RawModelSeedStrategyClass(modelSeedPolicy);
               break;
            }
            default: {
               throw new Error("Unrecognized BitStrategyKind: " + modelSeedPolicy.bitMode);
            }
         }

         this.seedStrategyMap.set(modelSeedPolicy.name, nextStrategy);
      }

      let imagePolicy: ImageFieldPolicy
      for (imagePolicy of this.randomArtPlayAssets.imagePolicies) {
         const thumbCanvas: CanvasDimensions = {
            pixelHeight: imagePolicy.thumbnail.pixelHeight,
            pixelWidth: imagePolicy.thumbnail.pixelWidth,
            scaleFactor: imagePolicy.unitScale,
            fitOrFill: imagePolicy.fitOrFill
         };

         const fullCanvas: CanvasDimensions = {
            pixelHeight: imagePolicy.fullSize.pixelHeight,
            pixelWidth: imagePolicy.fullSize.pixelWidth,
            scaleFactor: imagePolicy.unitScale,
            fitOrFill: imagePolicy.fitOrFill
         };

         const sanityCanvas: CanvasDimensions = {

         }
      }
   }

   public load
}

