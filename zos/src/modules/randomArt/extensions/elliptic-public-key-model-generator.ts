import {EllipticPublicKeyModel} from './elliptic-public-key-model.class';
import {EllipticModelGenConfig} from './config/elliptic-model-gen-config.value';
import {Chan, CLOSED, take} from 'medium';
import {EllipticPublicKeySource} from './elliptic-public-key-model-factory.class';
import {NamedVariant} from './config/named-variant.value';

export class EllipticPublicKeyModelGenerator implements Iterable<Promise<EllipticPublicKeyModel[]>>
{
   constructor(
      public readonly genConfig: EllipticModelGenConfig,
      private readonly channel: Chan<EllipticPublicKeySource>)
   { }

   public * [Symbol.iterator](): IterableIterator<Promise<EllipticPublicKeyModel[]>>
   {
      // let generation = !!this.genConfig.firstGeneration ? this.genConfig.firstGeneration : 1;
      for (let _ of this.genConfig.pathIterOne) {
         yield take(this.channel).then((keySource: EllipticPublicKeySource|CLOSED) => {
            if (keySource instanceof EllipticPublicKeySource) {
               let namedVariant: NamedVariant;
               const keyModels: EllipticPublicKeyModel[] = [];
               for (namedVariant of this.genConfig.variants) {
                  keyModels.push(keySource.applyVariant(namedVariant));
               }

               return keyModels;
            } else {
               return [];
            }
         });
      }
   }
}