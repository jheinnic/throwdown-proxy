import * as path from 'path';
// import {IPseudoRandomSource, IPseudoRandomSourceFactory, IsaacPseudoRandomSourceFactory} from
// '../../../infrastructure/randomize/index';
import {ITaskContentAdapter} from '../interfaces/task-content-adapter.interface';
import {EllipticPublicKeyModel} from './elliptic-public-key-model.class';


export class EllipticPublicKeyModelAdapter implements ITaskContentAdapter<EllipticPublicKeyModel>
{
   public convertToModelSeed(sourceContent: EllipticPublicKeyModel): [number[], number[]]
   {
      return [[...sourceContent.prefixBits], [...sourceContent.suffixBits]];
   }

   public convertToImagePath(sourceContent: EllipticPublicKeyModel, dimensionToken: string): string
   {
      return path.join(
         sourceContent.relativePath,
         sourceContent.nameExtension + '_' +
         sourceContent.generation.toString() + '-' +
         dimensionToken + '.png'
      );
   }

   public isNovelStrategy(sourceContent: EllipticPublicKeyModel): boolean
   {
      return sourceContent.novel;
   }
}




// function toPrivateKeyFile(genModel: EllipticModelGenConfig, deployCfg: Deployment, pathName: string): string
// {
//    return path.join(
//       genModel.outputRoot,
//       deployCfg.dataSetPaths.ticketKeyPairs,
//       pathName + '_private.key');
// }
