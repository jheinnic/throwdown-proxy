import {ModelSeed} from '../../../randomArt/messages';
import {BitStrategyKind} from '../../config';
import {Name} from '../../../../infrastructure/validation';

export interface IAsyncPaintModelSeedStrategy {
   readonly name: Name;

   readonly strategyKind: BitStrategyKind;

   extractSeed(publicKeyX: Buffer, publicKeyY: Buffer): Promise<ModelSeed>
}