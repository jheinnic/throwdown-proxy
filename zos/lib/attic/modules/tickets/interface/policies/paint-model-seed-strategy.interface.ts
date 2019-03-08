import {ModelSeed} from '../../../randomArt/messages';
import {BitStrategyKind} from '../../config';
import {Name} from '../../../../../../src/infrastructure/validation';

export interface IPaintModelSeedStrategy {
   readonly name: Name;

   readonly strategyKind: BitStrategyKind;

   extractSeed(publicKeyX: Buffer, publicKeyY: Buffer): ModelSeed | Promise<ModelSeed>
}